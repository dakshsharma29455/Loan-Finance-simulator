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

    if (!monthlyIncome || !assetCost || monthlyIncome <= 0 || assetCost <= 0) {
        verdictOutput.innerHTML =`<p style ="color: #ef4444; font-weight: 600;">⚠️ Please enter valid numbers for Monthly Income and Asset Price.</p>`;
        return;

    }
    

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

    let statusBadge = "";
    let statusClass = "";
    let adviceText = "";

    if( dtiRatio <= maxAllowedDIT) {
        statusBadge = "Approved ✅";
        statusClass = "status-approved";
        adviceText = "Great news! based on your income";


    } else {
        statusBadge = "Budget Exceeded !!";
        statusClass = "status-denied";


        const maxAllowedEMI = (monthlyIncome * (maxAllowedDIT / 100)) - existingDebts;
        if (maxAllowedEMI <= 0) {
            adviceText = `Your current debts are already occupying major part of your income. We recommed you to pay first that after that finance this asset.`
        } else {
            adviceText = `This loan will push your Debt-to-Income ratio to <strong>${dtiRatio.toFixed(1)}%</strong>. To qualify, consider increasing your down`
        }
    }    
    verdictOutput.innerHTML =`
        <div class="${statusClass}">
            <h3>${statusBadge}</h3>
            <p>${adviceText}</p>
        </div>     
        
    `;
    



});