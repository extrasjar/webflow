
<script>
document.addEventListener('DOMContentLoaded', function() {
    
    const discounts = {
        "65-to-69": {"base-tier": 0.2871, "none": 0, "tier-1": 0.20507, "tier-2": 0.12303, "tier-3": 0},
        "70-plus": {"base-tier": 0.32812, "none": 0, "tier-1": 0.24608, "tier-2": 0.16405, "tier-3": 0},
        "less-than-65": {"base-tier": 0.24608, "none": 0, "tier-1": 0.16405, "tier-2": 0.08202, "tier-3": 0}
    };
    let discountDecimalValue = discounts['less-than-65']['base-tier'];
    let mbrType = 'Single';
    let state = 'NSW';
    let payFreq = 'Weekly';
    let excess = '750';
    let age = 'Less than 65';
    let rebate = 'Base Tier';
    
    function getURLParameters() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

    function convertAgeDisplayToKey(displayValue) {
        const ageMappings = {
            "65 to 69": "65-to-69",
            "70 plus": "70-plus",
            "Less than 65": "less-than-65",
        };
        return ageMappings[displayValue] || displayValue; 
    }

    function convertRebateDisplayToKey(displayValue) {
        const rebateMappings = {
            "Base Tier": "base-tier",
            "Tier 1": "tier-1",
            "Tier 2": "tier-2",
            "Tier 3": "tier-3",
            "None": "none",
        };
        return rebateMappings[displayValue] || displayValue; 
    }

    function convertMembershipTypeToDisplay(type) {
    const mappings = {
        "family": "Family",
        "single": "Single",
        "couple": "Couple",
        "singleparentfamily": "Single Parent Family",
        "singleanydependants": "Extended Single Parent Family",
        "coupleanydependants": "Extended Family",
        
    };
    return mappings[type] || type; 
}

function convertStateToDisplay(stateCode) {
    const stateMappings = {
        "act": "ACT",
        "nt": "NT",
        "wa": "WA",
        "vic": "VIC",
        "sa": "SA",
        "qld": "QLD",
        "tas": "TAS",
        "nsw": "NSW",
        
    };
    return stateMappings[stateCode] || stateCode;
}
function convertPaymentCycleToDisplay(paymentCycle) {
    const paymentCycleMappings = {
        "monthly": "Monthly",
        "weekly": "Weekly",
        "annually": "Annually",
        
    };
    return paymentCycleMappings[paymentCycle.toLowerCase()] || paymentCycle; 
}

function setValuesFromURLParams() {
    const params = getURLParameters();

    if (params['membership-type']) {
        mbrType = convertMembershipTypeToDisplay(params['membership-type']);
        updateDisplay('mbrtype_display', mbrType);
    }
    if (params['state']) {
        state = convertStateToDisplay(params['state']);
        updateDisplay('state_display', state);
    }
    if (params['excess']) {
        excess = params['excess']; 
        updateDisplay('excess_display', excess);
    }
    if (params['payment-cycle']) {
        payFreq = convertPaymentCycleToDisplay(params['payment-cycle']); 
        updateDisplay('payfrq_display', payFreq);
    }

    updatePriceDisclaimer();
    updateDiscountDisplay();
}


    function updateDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value;
    }

    function updateRebateDisplays() {
        const ids = ['dp_bronze', 'dp_bronze_plus', 'dp_silver', 'dp_silver_plus', 'dp_silver_family'];
        ids.forEach(id => {
            const basePriceElement = document.getElementById(id);
            if (!basePriceElement) {
                return;
            }

            const basePrice = parseFloat(basePriceElement.textContent) || 0;
            const discountedPrice = basePrice - (basePrice * discountDecimalValue);
            const displayElement = document.getElementById(`${id}_display`);
            if (displayElement) {
                displayElement.textContent = `${discountedPrice.toFixed(2)}`;
            }
        });
    }

    function updatePriceDisclaimer() {
        const disclaimer = `Price is for ${mbrType} in ${state} paying ${payFreq} with an excess of $${excess}, for age group ${age}, with a rebate tier of ${rebate}. Excludes any Youth Discount and excludes Lifetime Health Cover loading, and an Australian Government Rebate of ${(discountDecimalValue * 100).toFixed(3)}%.`;
        updateDisplay('price-disclaimer', disclaimer);
    }

    function updateDiscountDisplay() {
        let ageKey = convertAgeDisplayToKey(age); 
        let rebateKey = convertRebateDisplayToKey(rebate); 

        if (discounts[ageKey] && discounts[ageKey][rebateKey] !== undefined) {
            discountDecimalValue = discounts[ageKey][rebateKey];
            updateDisplay('discountDisplay', `${(discountDecimalValue * 100).toFixed(3)}%`);
            updateRebateDisplays();
        } else {
            console.error("Error: Invalid age or rebate tier.", {age: ageKey, rebate: rebateKey});
        }
    }

    function setDefaultDisplays() {
        updateDisplay('mbrtype_display', mbrType);
        updateDisplay('state_display', state);
        updateDisplay('payfrq_display', payFreq);
        updateDisplay('excess_display', excess);
        updateDisplay('age_display', age);
        updateDisplay('rebate_display', rebate);
        updateDiscountDisplay();
    }

    setupEventListeners();

    function setupEventListeners() {
        document.querySelectorAll('input[name="Membership"]').forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    mbrType = this.nextElementSibling.innerText;
                    updateDisplay('mbrtype_display', mbrType);
                    updatePriceDisclaimer();
                }
            });
        });
        document.getElementById('RP_State').addEventListener('change', function() {
            state = this.options[this.selectedIndex].text;
            updateDisplay('state_display', state);
            updatePriceDisclaimer();
        });
    
        document.getElementById('Pay-Cycle').addEventListener('change', function() {
            payFreq = this.options[this.selectedIndex].text;
            updateDisplay('payfrq_display', payFreq);
            updatePriceDisclaimer();
        });
        document.querySelectorAll('input[name="RP-Excess"]').forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    excess = this.nextElementSibling.innerText;
                    updateDisplay('excess_display', excess);
                    updatePriceDisclaimer();
                }
            });
        });
    
        document.getElementById('ageSelect').addEventListener('change', function() {
            age = this.options[this.selectedIndex].text;
            updateDisplay('age_display', age);
            updateDiscountDisplay(); 
            updatePriceDisclaimer();
        });
    
        document.getElementById('rebateSelect').addEventListener('change', function() {
            rebate = this.options[this.selectedIndex].text;
            updateDisplay('rebate_display', rebate);
            updateDiscountDisplay(); 
            updatePriceDisclaimer();
        });
    }
    function isJetboostReady() {
        const collectionIds = ['cl_bronze', 'cl_bronze_plus', 'cl_silver', 'cl_silver_plus', 'cl_silver_family'];
        const ready = collectionIds.every(id => {
            const collection = document.getElementById(id);
            if (!collection) {
                return false;
            }
    
            let visibleItemCount = 0;
            Array.from(collection.children).forEach(child => {
                const style = window.getComputedStyle(child);
                if (style.display !== 'none' && style.visibility !== 'hidden' && child.offsetWidth > 0 && child.offsetHeight > 0) {
                    visibleItemCount++;
                }
            });
    
            return visibleItemCount === 0 || visibleItemCount === 1;
        });
    
        return ready;
    }
    
    function waitForJetboost() {
    if (isJetboostReady()) {
        let calcDiv = document.getElementById('calc');
        calcDiv.style.opacity = '1'; 
        calcDiv.classList.add('slide-out-right');
        setDefaultDisplays();
        setValuesFromURLParams(); 
        setupEventListeners();
        attachFormSubmitListener();
    } else {
        setTimeout(waitForJetboost, 500);
    }
}
    
    function attachFormSubmitListener() {
        const submitButton = document.getElementById('update_price');
        if (submitButton) {
            submitButton.removeEventListener('click', handleSubmitClick);
            submitButton.addEventListener('click', handleSubmitClick);
        } else {
            setTimeout(attachFormSubmitListener, 500);
        }
    }
    
    function handleSubmitClick(event) {
        event.preventDefault(); 
        updateRebateDisplays(); 
        updatePriceDisclaimer();
        
    }

    waitForJetboost();
});
</script>