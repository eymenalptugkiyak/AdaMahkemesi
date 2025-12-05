/** 
 *Ada Mahkemesi Hesaplayıcı
 */

// Hakim Sayısı Sabiti
const JUDGE_COUNT = 5;


document.addEventListener('DOMContentLoaded', () => {
    createJudgeInputs();

    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateStrategy);
    }

    const juryInput = document.getElementById('juryCount');
    const helpText = document.getElementById('juryMajorityHelp');
    // Jüri sayısı girdisi - Girdiğimiz sayıya göre salt çoğunluk sayısını mesaj olarak kutucuğun altına verir. 
    if(juryInput && helpText) {
        juryInput.addEventListener('input', function() {
            const val = parseInt(this.value);
            if(val > 0) {
                const majority = Math.floor(val / 2) + 1;
                helpText.innerHTML = `<i class="fa-solid fa-info-circle mr-1"></i> Salt çoğunluk için <strong>en az ${majority} kişiye</strong> rüşvet verilmeli.`;
                helpText.classList.remove('hidden');
            } else {
                helpText.classList.add('hidden');
            }
        });
    }
});
// Yukardaki Hakim Sayısı Sabitine göre tablo oluşturur.
function createJudgeInputs() {
    const container = document.getElementById('judgesContainer');
    if(!container) return;
    container.innerHTML = '';
    
    for (let i = 1; i <= JUDGE_COUNT; i++) {
        const judgeHTML = `
        <div class="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors group">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-slate-600 transition-colors">
                    ${i}
                </div>
                <span class="text-sm font-semibold text-slate-200">Hakim #${i}</span>
                <div class="flex-grow h-px bg-slate-700/50"></div>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                <div class="relative">
                    <label class="block text-[10px] text-emerald-400/80 mb-1 font-medium ml-1">BERAAT (DİREKT)</label>
                    <div class="flex items-center bg-slate-900 rounded-lg border border-slate-700 focus-within:border-emerald-500/50 transition-colors">
                        <span class="pl-2 text-slate-500 text-xs">€</span>
                        <input type="number" id="j${i}_acquit" class="w-full bg-transparent p-1.5 text-sm text-white outline-none placeholder-slate-600" placeholder="-">
                    </div>
                </div>
                <div class="relative">
                    <label class="block text-[10px] text-amber-400/80 mb-1 font-medium ml-1">ÇEKİMSER (+JÜRİ)</label>
                    <div class="flex items-center bg-slate-900 rounded-lg border border-slate-700 focus-within:border-amber-500/50 transition-colors">
                        <span class="pl-2 text-slate-500 text-xs">€</span>
                        <input type="number" id="j${i}_abstain" class="w-full bg-transparent p-1.5 text-sm text-white outline-none placeholder-slate-600" placeholder="-">
                    </div>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += judgeHTML;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', { 
        style: 'currency', 
        currency: 'EUR', 
        maximumFractionDigits: 0 
    }).format(amount);
}

// Algoritmanın hesaplama kısmı
function calculateStrategy() {
    const juryCount = parseInt(document.getElementById('juryCount').value) || 0;
    const juryCost = parseFloat(document.getElementById('juryCost').value) || 0;
   // Eğer bir jüri sayısı girilmediyse uyarı verir.
    if (juryCount <= 0) {
        alert("Lütfen geçerli bir jüri sayısı giriniz.");
        return;
    }

    const majorityCount = Math.floor(juryCount / 2) + 1;
    const costFullJury = juryCount * juryCost;
    const costHalfJury = majorityCount * juryCost;

    let scenarios = [];

    // 3.yol yani hakim farketmeksizin tüm jüriye para verilirse gerçekleşir. 
    scenarios.push({
        id: 'global_jury',
        type: 'Tam Jüri Satın Alma',
        judge: 'Hepsi',
        cost: costFullJury,
        detail: `Hakim "Suçlu" dese bile ${juryCount} jüri üyesine rüşvet verilir.`,
        icon: 'fa-users'
    });

    // Hakimleri for döngüsü (loop) içine alıp senaryoları tek tek dener.
    for (let i = 1; i <= JUDGE_COUNT; i++) {
        // Değerleri string olarak al
        const acquitVal = document.getElementById(`j${i}_acquit`).value;
        const abstainVal = document.getElementById(`j${i}_abstain`).value;

        // 1.Yol Doğrudan beraat yani hakimlere özel beraat rüşveti ödenilirse serbest kalıyosun
        if (acquitVal !== '') {
            scenarios.push({
                id: `j${i}_direct`,
                type: 'Doğrudan Beraat',
                judge: `Hakim #${i}`,
                cost: parseFloat(acquitVal),
                detail: `Sadece Hakim #${i}'e ödeme yapılır.`,
                icon: 'fa-gavel'
            });
        }

        // 2.Yol Çekimser ücreti bu parayı ödeyip bir de jürinin salt çoğunluk sayısının rüşvetini ödersen serbest kalıyosun
        if (abstainVal !== '') {
            const totalAbstainCost = parseFloat(abstainVal) + costHalfJury;
            scenarios.push({
                id: `j${i}_abstain`,
                type: 'Çekimser + Jüri',
                judge: `Hakim #${i}`,
                cost: totalAbstainCost,
                detail: `Hakim #${i} (${formatCurrency(parseFloat(abstainVal))}) + ${majorityCount} Jüri (${formatCurrency(costHalfJury)})`,
                icon: 'fa-handshake'
            });
        }
    }
    // Eğer hiç bir değer girilmediyse ekrana bu yazıyı gösterir
    if (scenarios.length === 0) {
        alert("Lütfen en az bir hakim verisi veya jüri bilgisi giriniz.");
        return;
    }

    // Bütün senaryoları sıralar
    scenarios.sort((a, b) => a.cost - b.cost);

    renderResults(scenarios);
}

function renderResults(scenarios) {
    const emptyState = document.getElementById('emptyState');
    const resultsContainer = document.getElementById('resultsContainer');

    emptyState.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    resultsContainer.classList.remove('animate-fade-in');
    void resultsContainer.offsetWidth; 
    resultsContainer.classList.add('animate-fade-in');

    const best = scenarios[0];
    
    document.getElementById('bestPriceDisplay').textContent = formatCurrency(best.cost);
    document.getElementById('bestMethodDisplay').innerHTML = `
        <i class="fa-solid ${best.icon} mr-2"></i> ${best.type} 
        <span class="opacity-60 text-sm ml-2">(${best.judge})</span>
    `;
    document.getElementById('bestDetailDisplay').textContent = best.detail;

    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = ''; 

    scenarios.forEach((s, index) => {
        const isBest = index === 0;
        const trClass = isBest 
            ? 'bg-emerald-500/10 border-l-4 border-emerald-500 hover:bg-emerald-500/20 transition-colors' 
            : 'border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors text-slate-400';
        const costClass = isBest ? 'text-emerald-400 font-bold text-lg' : 'text-slate-300';
        const rankDisplay = isBest ? '<i class="fa-solid fa-trophy text-emerald-500"></i>' : index + 1;

        const html = `
        <tr class="${trClass}">
            <td class="p-4 font-semibold text-center">${rankDisplay}</td>
            <td class="p-4 font-medium text-white">${s.type}</td>
            <td class="p-4 text-sm">${s.judge}</td>
            <td class="p-4 text-xs opacity-70 hidden sm:table-cell">${s.detail}</td>
            <td class="p-4 text-right ${costClass}">${formatCurrency(s.cost)}</td>
        </tr>
        `;
        tbody.innerHTML += html;
    });
}

