// Registration Modal Logic - Cumbre-style with Group Support
export class RegistrationModal {
    constructor() {
        this.participants = [];
        this.selectedChurch = null;
        this.currency = 'COP'; // Default to Colombia
        this.leaderId = 'leader';

        // Pricing structure (from Cumbre)
        this.prices = {
            COP: {
                lodging: 850000,
                no_lodging: 660000,
                child_0_7: 300000,
                child_7_13: 550000
            },
            USD: {
                lodging: 220,
                no_lodging: 170,
                child_0_7: 80,
                child_7_13: 140
            }
        };

        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateSummary();
    }

    cacheDOM() {
        this.modal = document.getElementById('manual-registration-modal');
        this.form = document.getElementById('manual-registration-form');
        this.closeBtn = document.getElementById('btn-close-manual-modal');
        this.cancelBtn = document.getElementById('btn-cancel-manual-reg');

        // Leader fields
        this.leaderName = document.getElementById('reg-leader-name');
        this.leaderAge = document.getElementById('reg-leader-age');
        this.leaderPackage = document.getElementById('reg-leader-package');

        // Companion form
        this.btnAddCompanion = document.getElementById('btn-add-companion');
        this.addCompanionForm = document.getElementById('add-companion-form');
        this.companionName = document.getElementById('companion-name');
        this.companionAge = document.getElementById('companion-age');
        this.companionPackage = document.getElementById('companion-package');
        this.companionPackageContainer = document.getElementById('companion-package-container');
        this.btnSaveCompanion = document.getElementById('btn-save-companion');
        this.btnCancelCompanion = document.getElementById('btn-cancel-companion');

        // Lists
        this.companionsList = document.getElementById('companions-list');
        this.companionsEmpty = document.getElementById('companions-empty');
        this.summaryList = document.getElementById('summary-list');

        // Summary
        this.summarySubtotal = document.getElementById('summary-subtotal');
        this.summaryTotal = document.getElementById('summary-total');

        // Payment
        this.paymentOptions = document.querySelectorAll('input[name="payment_option"]');
        this.installmentDetails = document.getElementById('installment-details');
        this.depositAmountLabel = document.getElementById('deposit-amount-label');
        this.installmentFrequencyInputs = document.querySelectorAll('input[name="installment_frequency"]');
        this.installmentCount = document.getElementById('installment-count');
        this.installmentAmount = document.getElementById('installment-amount');

        // Church selector
        this.btnOpenChurchSelector = document.getElementById('btn-open-church-selector');
        this.selectedChurchDisplay = document.getElementById('selected-church-display');
        this.selectedChurchId = document.getElementById('selected-church-id');

        // Status
        this.statusMsg = document.getElementById('manual-reg-status');
    }

    bindEvents() {
        // Modal controls
        this.closeBtn?.addEventListener('click', () => this.close());
        this.cancelBtn?.addEventListener('click', () => this.close());
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Leader updates
        this.leaderName?.addEventListener('input', () => this.updateLeaderParticipant());
        this.leaderAge?.addEventListener('input', () => this.updateLeaderParticipant());
        this.leaderPackage?.addEventListener('change', () => this.updateLeaderParticipant());

        // Companion form
        this.btnAddCompanion?.addEventListener('click', () => this.showCompanionForm());
        this.btnCancelCompanion?.addEventListener('click', () => this.hideCompanionForm());
        this.btnSaveCompanion?.addEventListener('click', () => this.saveCompanion());
        this.companionAge?.addEventListener('input', () => this.updateCompanionPackageVisibility());

        // Payment options
        this.paymentOptions?.forEach(input => {
            input.addEventListener('change', () => this.updatePaymentUI());
        });

        this.installmentFrequencyInputs?.forEach(input => {
            input.addEventListener('change', () => this.updateInstallmentPreview());
        });

        // Form submission
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Participant Management
    updateLeaderParticipant() {
        const name = this.leaderName?.value?.trim();
        const age = this.parseAge(this.leaderAge?.value);
        const packageChoice = this.leaderPackage?.value || 'lodging';

        if (!name) return;

        const packageType = age !== null ? this.getPackageTypeFromAge(age, packageChoice) : packageChoice;

        const existing = this.participants.find(p => p.isLeader);
        if (existing) {
            existing.name = name;
            existing.age = age;
            existing.packageType = packageType;
        } else {
            this.participants.unshift({
                id: this.leaderId,
                name,
                age,
                packageType,
                isLeader: true
            });
        }

        this.renderParticipants();
        this.updateSummary();
    }

    showCompanionForm() {
        this.addCompanionForm?.classList.remove('hidden');
        this.btnAddCompanion?.classList.add('hidden');
        this.companionName?.focus();
    }

    hideCompanionForm() {
        this.addCompanionForm?.classList.add('hidden');
        this.btnAddCompanion?.classList.remove('hidden');
        this.clearCompanionForm();
    }

    clearCompanionForm() {
        if (this.companionName) this.companionName.value = '';
        if (this.companionAge) this.companionAge.value = '';
        if (this.companionPackage) this.companionPackage.value = 'lodging';
    }

    updateCompanionPackageVisibility() {
        const age = this.parseAge(this.companionAge?.value);
        const isChild = age !== null && age <= 10;

        if (this.companionPackageContainer) {
            this.companionPackageContainer.style.opacity = isChild ? '0.5' : '1';
        }
        if (this.companionPackage) {
            this.companionPackage.disabled = isChild;
        }
    }

    saveCompanion() {
        const name = this.companionName?.value?.trim();
        const age = this.parseAge(this.companionAge?.value);
        const packageChoice = this.companionPackage?.value || 'lodging';

        if (!name) {
            alert('Ingresa el nombre del acompañante');
            return;
        }

        if (age === null || age < 0 || age > 120) {
            alert('Ingresa una edad válida');
            return;
        }

        const packageType = this.getPackageTypeFromAge(age, packageChoice);

        this.participants.push({
            id: Date.now(),
            name,
            age,
            packageType,
            isLeader: false
        });

        this.hideCompanionForm();
        this.renderParticipants();
        this.updateSummary();
    }

    removeParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        this.renderParticipants();
        this.updateSummary();
    }

    renderParticipants() {
        if (!this.companionsList || !this.summaryList) return;

        const companions = this.participants.filter(p => !p.isLeader);

        // Main list
        if (companions.length === 0) {
            this.companionsList.innerHTML = '';
            this.companionsEmpty?.classList.remove('hidden');
        } else {
            this.companionsEmpty?.classList.add('hidden');
            this.companionsList.innerHTML = companions.map(p => this.renderParticipantItem(p)).join('');

            // Bind remove buttons
            this.companionsList.querySelectorAll('.btn-remove-participant').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.participantId);
                    this.removeParticipant(id);
                });
            });
        }

        // Summary list
        if (this.participants.length === 0) {
            this.summaryList.innerHTML = '<p class="italic text-white/30 text-xs">Agrega participantes...</p>';
        } else {
            this.summaryList.innerHTML = this.participants.map(p => this.renderSummaryItem(p)).join('');
        }
    }

    renderParticipantItem(p) {
        const price = this.getPrice(p.packageType);
        const ageLabel = p.age !== null ? ` · ${p.age} años` : '';

        return `
      <div class="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div class="flex-1">
          <div class="font-bold text-[#293C74] text-sm">${p.name}</div>
          <div class="text-xs text-slate-500">${this.getTypeLabel(p.packageType)}${ageLabel}</div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-[#293C74]">${this.formatPrice(price)}</span>
          <button type="button" class="btn-remove-participant text-red-500 hover:text-red-700 text-xs underline" data-participant-id="${p.id}">Eliminar</button>
        </div>
      </div>
    `;
    }

    renderSummaryItem(p) {
        const price = this.getPrice(p.packageType);
        const leaderBadge = p.isLeader ? ' <span class="text-brand-teal text-[10px]">(Responsable)</span>' : '';

        return `
      <div class="flex justify-between text-xs text-white/80">
        <span>${p.name}${leaderBadge}</span>
        <span class="opacity-70">${this.formatPrice(price)}</span>
      </div>
    `;
    }

    // Pricing Logic
    parseAge(value) {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : null;
    }

    getPackageTypeFromAge(age, lodgingChoice) {
        if (age <= 4) return 'child_0_7';
        if (age <= 10) return 'child_7_13';
        return lodgingChoice === 'no_lodging' ? 'no_lodging' : 'lodging';
    }

    getPrice(packageType) {
        const priceMap = this.currency === 'COP' ? this.prices.COP : this.prices.USD;
        return priceMap[packageType] || 0;
    }

    getTypeLabel(type) {
        const labels = {
            lodging: 'Con Alojamiento',
            no_lodging: 'Sin Alojamiento',
            child_0_7: 'Niño 0-4 años',
            child_7_13: 'Niño 5-10 años'
        };
        return labels[type] || type;
    }

    formatPrice(amount) {
        if (this.currency === 'COP') {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(amount);
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }

    getTotal() {
        return this.participants.reduce((sum, p) => sum + this.getPrice(p.packageType), 0);
    }

    updateSummary() {
        const total = this.getTotal();

        if (this.summarySubtotal) this.summarySubtotal.textContent = this.formatPrice(total);
        if (this.summaryTotal) this.summaryTotal.textContent = this.formatPrice(total);

        // Update deposit amount
        const deposit = Math.round(total * 0.5);
        if (this.depositAmountLabel) {
            this.depositAmountLabel.textContent = this.formatPrice(deposit);
        }

        this.updateInstallmentPreview();
    }

    // Payment UI
    updatePaymentUI() {
        const selected = document.querySelector('input[name="payment_option"]:checked');
        const value = selected?.value || 'FULL';

        if (this.installmentDetails) {
            this.installmentDetails.classList.toggle('hidden', value !== 'INSTALLMENTS');
        }

        if (value === 'INSTALLMENTS') {
            this.updateInstallmentPreview();
        }
    }

    updateInstallmentPreview() {
        const total = this.getTotal();
        const frequency = document.querySelector('input[name="installment_frequency"]:checked')?.value || 'MONTHLY';
        const deadline = '2026-05-15'; // Cumbre deadline

        const [year, month, day] = deadline.split('-').map(Number);
        const end = new Date(Date.UTC(year, month - 1, day));
        const now = new Date();
        const current = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        if (end < current) {
            if (this.installmentCount) this.installmentCount.textContent = '1';
            if (this.installmentAmount) this.installmentAmount.textContent = this.formatPrice(total);
            return;
        }

        // Calculate installments
        const dueDates = [];
        let tempDate = new Date(current);

        while (tempDate <= end) {
            dueDates.push(new Date(tempDate));
            if (frequency === 'BIWEEKLY') {
                tempDate.setUTCDate(tempDate.getUTCDate() + 14);
            } else {
                tempDate.setUTCMonth(tempDate.getUTCMonth() + 1);
            }
        }

        const count = Math.max(1, dueDates.length);
        const amount = Math.round(total / count);

        if (this.installmentCount) this.installmentCount.textContent = count;
        if (this.installmentAmount) this.installmentAmount.textContent = this.formatPrice(amount);
    }

    // Form Submission
    async handleSubmit(e) {
        e.preventDefault();

        if (this.participants.length === 0) {
            alert('Debes agregar al menos un participante (el responsable)');
            return;
        }

        if (!this.selectedChurch) {
            alert('Selecciona una iglesia');
            return;
        }

        const formData = this.collectFormData();

        if (this.statusMsg) {
            this.statusMsg.textContent = 'Registrando grupo...';
            this.statusMsg.className = 'mt-4 text-sm text-center text-white/60';
        }

        try {
            const response = await fetch('/api/portal/iglesia/register-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al registrar el grupo');
            }

            if (this.statusMsg) {
                this.statusMsg.textContent = '✓ Grupo registrado exitosamente';
                this.statusMsg.className = 'mt-4 text-sm text-center text-green-400 font-bold';
            }

            setTimeout(() => {
                this.close();
                window.location.reload(); // Refresh to show new registrations
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            if (this.statusMsg) {
                this.statusMsg.textContent = `Error: ${error.message}`;
                this.statusMsg.className = 'mt-4 text-sm text-center text-red-400';
            }
        }
    }

    collectFormData() {
        const paymentOption = document.querySelector('input[name="payment_option"]:checked')?.value || 'FULL';
        const installmentFrequency = document.querySelector('input[name="installment_frequency"]:checked')?.value || 'MONTHLY';

        return {
            church_id: this.selectedChurch?.id,
            country: document.getElementById('reg-country')?.value || 'Colombia',
            city: document.getElementById('reg-city')?.value || '',
            participants: this.participants.map(p => ({
                ...p,
                document_type: document.getElementById('reg-leader-doc-type')?.value || 'CC',
                document_number: document.getElementById('reg-leader-doc-number')?.value || '',
                email: p.isLeader ? document.getElementById('reg-leader-email')?.value : null,
                phone: p.isLeader ? document.getElementById('reg-leader-phone')?.value : null,
            })),
            payment_option: paymentOption,
            installment_frequency: installmentFrequency,
            total_amount: this.getTotal(),
            currency: this.currency,
        };
    }

    // Modal Controls
    open() {
        this.modal?.classList.remove('hidden');
        this.modal?.classList.add('flex');
        document.body.style.overflow = 'hidden';

        // Ensure leader is added
        this.updateLeaderParticipant();
    }

    close() {
        this.modal?.classList.add('hidden');
        this.modal?.classList.remove('flex');
        document.body.style.overflow = '';
        this.reset();
    }

    reset() {
        this.participants = [];
        this.selectedChurch = null;
        this.form?.reset();
        this.renderParticipants();
        this.updateSummary();
        if (this.statusMsg) this.statusMsg.textContent = '';
        if (this.selectedChurchDisplay) this.selectedChurchDisplay.textContent = 'Seleccionar iglesia...';
    }

    setChurch(church) {
        this.selectedChurch = church;
        if (this.selectedChurchDisplay) {
            this.selectedChurchDisplay.textContent = `${church.name} - ${church.city}`;
            this.selectedChurchDisplay.classList.remove('text-slate-400');
            this.selectedChurchDisplay.classList.add('text-[#293C74]', 'font-medium');
        }
        if (this.selectedChurchId) {
            this.selectedChurchId.value = church.id;
        }

        // Auto-fill city and country
        const cityInput = document.getElementById('reg-city');
        const countryInput = document.getElementById('reg-country');
        if (cityInput && church.city) cityInput.value = church.city;
        if (countryInput && church.country) countryInput.value = church.country;
    }
}
