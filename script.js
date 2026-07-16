const calculateBtn = document.getElementById("calculate-btn");
const incomeInput = document.getElementById("monthly-income");
const debtsInput = document.getElementById("existing-debts");
const assetTypeSelect = document.getElementById("asset-type");
const assetCostInput = document.getElementById("asset-cost");
const downPaymentInput = document.getElementById("down-payment");
const verdictOutput = document.getElementById("verdict-output");


const assetRules = {
    auto: {interestRate: 6.0, termonths: 60},
    home: {interestRate: 4.5, termonths: 270},
    tech: {interestRate:10.0, termonths:24}
};


function calculateEMI(principle, annualRate, months) {
    const monthlyRate = (annualRate / 12) / 100;
    if (monthlyRate === 0 ) return principle / months;
    
    const emi = (principle * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;


}



calculateBtn.addEventListener("click", () => {
    const monthlyIncome = parseFloat(incomeInput.value);
    const existingDebts = parseFloat(debtsInput.value) || 0;
    const assetCost = parseFloat(assetCostInput.value);
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const selectedAsset = assetTypeSelect.value;

    
    

    if (downPayment >= assetCost) {
        verdictOutput.innerHTML = `<p style="color: #ef4444; font-weight: 600;">⚠️ Down payment cannot be equal to or greater than the asset price.</p>`;
        return;
    }


    const { interestRate, termonths } = assetRules[selectedAsset];

    const principleLoanAmount = assetCost - downPayment;
    const estimatedEMI = calculateEMI(principleLoanAmount, interestRate, termonths);
    const totalAmountPaid = estimatedEMI * termonths;
    const totalInterestPaid = totalAmountPaid - principleLoanAmount;
    
    
    const totalFutureDebts = existingDebts + estimatedEMI;
    const dtiRatio = (totalFutureDebts / monthlyIncome) * 100;
    const maxAllowedDIT = 45;

    if (dtiRatio <= maxAllowedDIT) {
        
        verdictOutput.style.border = "1px solid #bbf7d0";
        verdictOutput.style.backgroundColor = "#f0fdf4";
        verdictOutput.innerHTML = `
            <div class="status-approved" style="text-align: left; font-family: sans-serif; color: #1e293b; padding: 5px;">
                <h3 style="margin: 0 0 15px 0; font-size: 1.4rem; color: #16a34a; font-weight: 700;">Approved ✅</h3>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; gap: 15px;">
                    <div style="flex: 1; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <span style="font-size: 0.85rem; color: #64748b; display: block; margin-bottom: 4px; font-weight: 600; text-transform: uppercase;">Monthly EMI</span>
                        <strong style="font-size: 1.25rem; color: #0f172a;">₹${estimatedEMI.toFixed(2)}</strong>
                    </div>
                    <div style="flex: 1; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <span style="font-size: 0.85rem; color: #64748b; display: block; margin-bottom: 4px; font-weight: 600; text-transform: uppercase;">Loan Duration</span>
                        <strong style="font-size: 1.25rem; color: #0f172a;">${termonths} Months</strong>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; gap: 15px;">
                    <div style="flex: 1; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <span style="font-size: 0.85rem; color: #64748b; display: block; margin-bottom: 4px; font-weight: 600; text-transform: uppercase;">Principal Amount</span>
                        <strong style="font-size: 1.1rem; color: #334155;">₹${principleLoanAmount.toFixed(2)}</strong>
                    </div>
                    <div style="flex: 1; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <span style="font-size: 0.85rem; color: #b91c1c; display: block; margin-bottom: 4px; font-weight: 600; text-transform: uppercase;">Total Interest</span>
                        <strong style="font-size: 1.1rem; color: #b91c1c;">₹${totalInterestPaid.toFixed(2)}</strong>
                    </div>
                </div>

                <div style="background: #e2e8f0; padding: 14px; border-radius: 8px; text-align: center; margin-bottom: 15px;">
                    <span style="font-size: 0.85rem; color: #475569; display: block; margin-bottom: 4px; font-weight: 600; text-transform: uppercase;">Total Repayment Amount</span>
                    <strong style="font-size: 1.4rem; color: #1e293b;">₹${totalAmountPaid.toFixed(2)}</strong>
                </div>

                <p style="margin: 0; font-size: 0.9rem; color: #475569;"><strong>Debt-to-Income (DTI) Ratio:</strong> ${dtiRatio.toFixed(1)}%</p>
            </div>
        `;
    } else {
        
        verdictOutput.style.border = "1px solid #fca5a5";
        verdictOutput.style.backgroundColor = "#fef2f2";
        verdictOutput.innerHTML = `
            <div class="status-denied" style="text-align: left; font-family: sans-serif; padding: 5px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; color: #dc2626; font-weight: 700;">Budget Exceeded !!</h3>
                <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5;">This loan will push your Debt-to-Income ratio to <strong>${dtiRatio.toFixed(1)}%</strong>, crossing the safe limit of 45%.</p>
            </div>
        `;
    }
    



});