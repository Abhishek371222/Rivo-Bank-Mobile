import { Loan, Payment } from './database';

// Calculate EMI using reducing balance method
export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
};

// Calculate daily interest
export const calculateDailyInterest = (outstandingBalance: number, annualRate: number): number => {
    const dailyRate = annualRate / 365 / 100;
    return Math.round(outstandingBalance * dailyRate);
};

// Calculate total interest for full tenure
export const calculateTotalInterest = (emi: number, tenureMonths: number, principal: number): number => {
    return (emi * tenureMonths) - principal;
};

// Check loan eligibility
export interface EligibilityResult {
    eligible: boolean;
    maxAmount: number;
    reason?: string;
    interestRate: number;
}

export const checkLoanEligibility = (
    creditScore: number,
    monthlyIncome: number,
    existingLoan: boolean,
    kycStatus: 'pending' | 'verified'
): EligibilityResult => {
    // KYC must be verified
    if (kycStatus !== 'verified') {
        return {
            eligible: false,
            maxAmount: 0,
            reason: 'KYC verification required',
            interestRate: 0,
        };
    }

    // Cannot have existing active loan
    if (existingLoan) {
        return {
            eligible: false,
            maxAmount: 0,
            reason: 'Please repay existing loan first',
            interestRate: 0,
        };
    }

    // Credit score based eligibility
    if (creditScore < 650) {
        return {
            eligible: false,
            maxAmount: 0,
            reason: 'Credit score too low (minimum 650 required)',
            interestRate: 0,
        };
    }

    // Determine max amount and interest rate based on credit score
    let maxAmount = 50000;
    let interestRate = 18; // Annual percentage

    if (creditScore >= 750) {
        maxAmount = 50000;
        interestRate = 12;
    } else if (creditScore >= 700) {
        maxAmount = 30000;
        interestRate = 15;
    } else {
        maxAmount = 15000;
        interestRate = 18;
    }

    return {
        eligible: true,
        maxAmount,
        interestRate,
    };
};

// Create new loan
export const createLoan = (
    userId: string,
    amount: number,
    tenure: number,
    interestRate: number
): Loan => {
    const emiAmount = calculateEMI(amount, interestRate, tenure);
    const borrowedDate = new Date();
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + tenure);

    return {
        id: `loan-${Date.now()}`,
        userId,
        amount,
        tenure,
        interestRate,
        status: 'active',
        borrowedDate: borrowedDate.toISOString(),
        dueDate: dueDate.toISOString(),
        outstandingBalance: amount,
        emiAmount,
        payments: [],
    };
};

// Process loan payment
export const processPayment = (
    loan: Loan,
    paymentAmount: number,
    paymentType: 'auto-debit' | 'manual' | 'prepayment'
): { updatedLoan: Loan; interestSaved: number } => {
    const payment: Payment = {
        id: `payment-${Date.now()}`,
        loanId: loan.id,
        amount: paymentAmount,
        date: new Date().toISOString(),
        type: paymentType,
    };

    const newOutstanding = Math.max(0, loan.outstandingBalance - paymentAmount);

    // Calculate interest saved on prepayment
    const daysSaved = paymentType === 'prepayment'
        ? Math.floor((new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const interestSaved = paymentType === 'prepayment'
        ? Math.round(calculateDailyInterest(paymentAmount, loan.interestRate) * daysSaved)
        : 0;

    const updatedLoan: Loan = {
        ...loan,
        outstandingBalance: newOutstanding,
        status: newOutstanding === 0 ? 'repaid' : 'active',
        payments: [...loan.payments, payment],
    };

    return { updatedLoan, interestSaved };
};

// Get next EMI details
export const getNextEMIDetails = (loan: Loan): {
    amount: number;
    dueDate: string;
    daysRemaining: number;
} => {
    const today = new Date();
    const nextEMIDate = new Date(loan.borrowedDate);

    // Find next EMI date
    while (nextEMIDate < today) {
        nextEMIDate.setMonth(nextEMIDate.getMonth() + 1);
    }

    const daysRemaining = Math.ceil((nextEMIDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
        amount: loan.emiAmount,
        dueDate: nextEMIDate.toISOString(),
        daysRemaining,
    };
};

// Calculate savings from early repayment
export const calculateEarlyRepaymentSavings = (loan: Loan, prepaymentAmount: number): {
    interestSaved: number;
    newOutstanding: number;
    newTenure: number;
} => {
    const newOutstanding = Math.max(0, loan.outstandingBalance - prepaymentAmount);
    const remainingMonths = Math.ceil(newOutstanding / loan.emiAmount);

    const daysUntilDue = Math.floor((new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const dailyInterest = calculateDailyInterest(prepaymentAmount, loan.interestRate);
    const interestSaved = Math.round(dailyInterest * daysUntilDue);

    return {
        interestSaved,
        newOutstanding,
        newTenure: remainingMonths,
    };
};
