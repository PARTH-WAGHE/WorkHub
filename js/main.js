document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SETUP ---
    const setupTheme = () => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    setupTheme();

    // --- MOCK DATA ---
    // Tailored for Pune, India at ~4 PM on a Tuesday
    const venuesData = [
        { id: 1, name: 'Goodluck Cafe', category: 'Cafe', location: 'Deccan Gymkhana', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop', crowdLevel: 65, waitTime: 10, tags: ['legacy', 'chai', 'bun maska', 'lively'] },
        { id: 2, name: 'German Bakery Wunderbar', category: 'Restaurant', location: 'Koregaon Park', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop', crowdLevel: 40, waitTime: 5, tags: ['continental', 'bakery', 'dinner', 'desserts', 'relaxed'] },
        { id: 3, name: 'Gold\'s Gym', category: 'Gym', location: 'Aundh', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', crowdLevel: 80, waitTime: 5, tags: ['weights', 'cardio', 'classes', 'busy'] },
        { id: 4, name: 'Enrich Salon', category: 'Salon', location: 'FC Road', image: 'https://images.unsplash.com/photo-1633611165203-903900a6f022?q=80&w=2070&auto=format&fit=crop', crowdLevel: 30, waitTime: 0, tags: ['haircut', 'styling', 'spa', 'quiet'] },
        { id: 5, name: 'High Spirits Cafe', category: 'Restaurant', location: 'Koregaon Park', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=2070&auto=format&fit=crop', crowdLevel: 15, waitTime: 0, tags: ['live music', 'bar', 'pizza', 'lively'] },
        { id: 6, name: 'Talwalkars Gym', category: 'Gym', location: 'Kothrud', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop', crowdLevel: 55, waitTime: 0, tags: ['yoga', 'cardio', 'personal training'] },
        { id: 7, name: 'Starbucks', category: 'Cafe', location: 'Viman Nagar', image: 'https://images.unsplash.com/photo-1572498738499-3c726d35165a?q=80&w=1974&auto=format&fit=crop', crowdLevel: 70, waitTime: 10, tags: ['coffee', 'work', 'wifi', 'quiet'] },
        { id: 8, name: 'Jawed Habib Hair & Beauty', category: 'Salon', location: 'Wakad', image: 'https://images.unsplash.com/photo-1521590832167-7ce63342a79d?q=80&w=2070&auto=format&fit=crop', crowdLevel: 45, waitTime: 5, tags: ['haircut', 'colour', 'unisex'] },
    ];
    let myBookingsData = [];

    // --- DOM ELEMENTS ---
    const placesGrid = document.getElementById('places-grid');
    const searchBar = document.getElementById('search-bar');
    const modalContainer = document.getElementById('modal-container');

    let filterState = { text: '', aiQuery: '', category: 'all', availability: 'any' };

    // --- LIVE CROWD SIMULATION ---
    setInterval(() => {
        venuesData.forEach(venue => {
            const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
            venue.crowdLevel = Math.max(0, Math.min(100, venue.crowdLevel + change));
            if (venue.crowdLevel > 70) {
                 venue.waitTime = Math.round((venue.crowdLevel - 70) / 3);
            } else {
                venue.waitTime = 0;
            }
        });
        renderVenues(filterState);
    }, 5000);

    // --- RENDER LOGIC ---
    const getCrowdInfo = (level) => {
        if (level < 40) return { text: 'Not Busy', color: 'text-green-500', barColor: 'bg-green-500' };
        if (level < 75) return { text: 'Moderate', color: 'text-yellow-500', barColor: 'bg-yellow-500' };
        return { text: 'Busy', color: 'text-red-500', barColor: 'bg-red-500' };
    };

    const renderVenues = (filters) => {
        let filteredVenues = [...venuesData];
        if (filters.text) {
            const text = filters.text.toLowerCase();
            filteredVenues = filteredVenues.filter(v => v.name.toLowerCase().includes(text) || v.location.toLowerCase().includes(text) || v.tags.some(t => t.includes(text)));
        }
        if (filters.category !== 'all') filteredVenues = filteredVenues.filter(v => v.category === filters.category);
        if (filters.availability === 'not_busy') filteredVenues = filteredVenues.filter(v => v.crowdLevel < 40);
        if (filters.availability === 'available_now') filteredVenues = filteredVenues.filter(v => v.crowdLevel < 85);
        if (filters.aiQuery) {
            const aiText = filters.aiQuery.toLowerCase();
            if (aiText.includes('quiet') || aiText.includes('work')) filteredVenues.sort((a, b) => a.crowdLevel - b.crowdLevel);
            if (aiText.includes('lively') || aiText.includes('popular')) filteredVenues.sort((a, b) => b.crowdLevel - a.crowdLevel);
        }
        
        placesGrid.innerHTML = filteredVenues.length ? filteredVenues.map(venue => {
            const crowd = getCrowdInfo(venue.crowdLevel);
            return `
                <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 venue-card">
                    <div class="relative">
                        <img src="${venue.image}" alt="${venue.name}" class="w-full h-48 object-cover">
                        <div class="absolute top-2 right-2 bg-gray-900/70 text-white text-xs font-bold px-2 py-1 rounded-full">${venue.category}</div>
                        <div class="absolute bottom-0 left-0 bg-gray-900/70 text-white text-xs px-2 py-1 font-medium">${venue.location}</div>
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${venue.name}</h3>
                        <div class="mb-4">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-sm font-semibold ${crowd.color}">${crowd.text}</span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${venue.waitTime > 0 ? `~${venue.waitTime} min wait` : 'No wait'}</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div class="crowd-bar-inner ${crowd.barColor} h-2.5 rounded-full" style="width: ${venue.crowdLevel}%"></div></div>
                        </div>
                        <div class="mt-auto">
                           <button class="book-now-btn w-full bg-gray-200 dark:bg-gray-700 hover:bg-teal-500 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 group-hover:bg-teal-500 group-hover:text-white" data-venue-id="${venue.id}">Book Now</button>
                        </div>
                    </div>
                </div>`;
        }).join('') : `<p class="text-gray-500 dark:text-gray-400 col-span-full text-center">No venues found. Try adjusting your filters.</p>`;
        
        document.querySelectorAll('.book-now-btn').forEach(b => b.addEventListener('click', e => openBookingModal(e.target.dataset.venueId)));
    };
    
    // --- MODAL FACTORY & HANDLING ---
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(!modal) return;
        modal.classList.remove('hidden');
        setTimeout(() => modal.querySelector('.modal').classList.remove('opacity-0', 'scale-95'), 10);
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(!modal) return;
        modal.querySelector('.modal').classList.add('opacity-0', 'scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    const createModal = (id, title, content, isLarge = false) => {
        const modalSize = isLarge ? 'max-w-lg' : 'max-w-md';
        const modalHTML = `
            <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${modalSize} mx-auto p-8 modal opacity-0 transform scale-95">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${title}</h3>
                        <button id="close-${id}" class="text-gray-400 hover:text-gray-800 dark:hover:text-white text-3xl">&times;</button>
                    </div>
                    ${content}
                </div>
            </div>`;
        modalContainer.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById(`close-${id}`).addEventListener('click', () => closeModal(id));
    };

    // --- SPECIFIC MODAL LOGIC ---
    const openBookingModal = (venueId) => {
        const venue = venuesData.find(v => v.id == venueId);
        const modalId = 'booking-modal';
        document.getElementById(modalId)?.remove();
        
        let preOrderSection = '';
        if (venue.category === 'Restaurant' || venue.category === 'Cafe') {
            preOrderSection = `<div><label for="preorder" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pre-order (Optional)</label><textarea id="preorder" rows="3" placeholder="e.g., 2x Cappuccino" class="input-field"></textarea></div>`;
        }
        
        const content = `
            <form id="booking-form" data-venue-id="${venue.id}">
                <div class="space-y-4">
                    <div><label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label><input type="text" id="name" required class="input-field"></div>
                    <div><label for="guests" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Guests</label><input type="number" id="guests" min="1" value="1" required class="input-field"></div>
                    <div><label for="datetime" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label><input type="datetime-local" id="datetime" required class="input-field"></div>
                    ${preOrderSection}
                </div>
                <div class="mt-8"><button type="submit" class="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg">Confirm Booking</button></div>
            </form>`;
        createModal(modalId, `Book at ${venue.name}`, content);
        openModal(modalId);
        
        document.getElementById('booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            myBookingsData.push({ 
                bookingId: Date.now(), 
                venueId: e.target.dataset.venueId, 
                name: document.getElementById('name').value, 
                guests: document.getElementById('guests').value, 
                datetime: document.getElementById('datetime').value,
                preOrder: document.getElementById('preorder')?.value || ''
            });
            closeModal(modalId);
            showToast('Booking confirmed!');
        });
    };
    
    const openFilterModal = () => {
        const modalId = 'filter-modal';
        document.getElementById(modalId)?.remove();
        const categories = [...new Set(venuesData.map(v => v.category))];
        const content = `
            <div class="space-y-6">
                <div><label for="ai-query" class="label">What are you looking for?</label><input type="text" id="ai-query" placeholder="e.g., 'a quiet place for coffee'" class="input-field" value="${filterState.aiQuery}"></div>
                <div><label class="label">Category</label><div id="category-filters" class="flex flex-wrap gap-2">${['All', ...categories].map(c=>`<button type="button" data-category="${c.toLowerCase()}" class="filter-btn ${filterState.category === c.toLowerCase() ? 'active':''}">${c}</button>`).join('')}</div></div>
                <div><label class="label">Availability</label><div id="availability-filters" class="flex flex-wrap gap-2"><button type="button" data-availability="any" class="filter-btn ${filterState.availability==='any'?'active':''}">Any</button><button type="button" data-availability="not_busy" class="filter-btn ${filterState.availability==='not_busy'?'active':''}">Not Busy</button><button type="button" data-availability="available_now" class="filter-btn ${filterState.availability==='available_now'?'active':''}">Available Now</button></div></div>
                <div class="flex justify-end gap-4 pt-4"><button type="button" id="reset-filters-btn" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Reset</button><button type="button" id="apply-filters-btn" class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg">Apply</button></div>
            </div>`;
        
        createModal(modalId, 'Smart Filters', content, true);
        openModal(modalId);

        document.querySelector('#category-filters').addEventListener('click', e => { 
            if (e.target.tagName === 'BUTTON') { 
                document.querySelectorAll('#category-filters button').forEach(b => b.classList.remove('active')); 
                e.target.classList.add('active'); 
            }
        });
        document.querySelector('#availability-filters').addEventListener('click', e => { 
            if (e.target.tagName === 'BUTTON') { 
                document.querySelectorAll('#availability-filters button').forEach(b => b.classList.remove('active')); 
                e.target.classList.add('active'); 
            }
        });
        
        document.getElementById('apply-filters-btn').addEventListener('click', () => {
            filterState.aiQuery = document.getElementById('ai-query').value;
            filterState.category = document.querySelector('#category-filters .active').dataset.category;
            filterState.availability = document.querySelector('#availability-filters .active').dataset.availability;
            renderVenues(filterState);
            closeModal(modalId);
        });
        document.getElementById('reset-filters-btn').addEventListener('click', () => { 
            filterState={text:searchBar.value, aiQuery:'', category:'all', availability:'any'}; 
            renderVenues(filterState); 
            closeModal(modalId); 
        });
    };
    
    const openMyBookingsModal = () => {
        const modalId = 'my-bookings-modal';
        document.getElementById(modalId)?.remove();
        
        let content;
        if (myBookingsData.length === 0) {
            content = `<p class="text-gray-500 dark:text-gray-400 text-center py-8">You have no upcoming bookings.</p>`;
        } else {
            content = `<div id="my-bookings-list" class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">${myBookingsData.map(b => {
                const venue = venuesData.find(v => v.id == b.venueId);
                const date = new Date(b.datetime);
                const fDate = isNaN(date) ? "Invalid Date" : date.toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric' });
                const fTime = isNaN(date) ? "" : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                return `<div class="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg flex items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <img src="${venue.image}" class="w-16 h-16 rounded-md object-cover hidden sm:block">
                        <div>
                            <p class="font-bold text-gray-900 dark:text-white">${venue.name}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">${fDate} at ${fTime}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${b.guests} guest(s)</p>
                            ${b.preOrder ? `<p class="text-xs text-gray-500 dark:text-gray-400">Pre-order: ${b.preOrder}</p>` : ''}
                        </div>
                    </div>
                    <button class="cancel-booking-btn text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm" data-booking-id="${b.bookingId}">Cancel</button>
                </div>`
            }).join('')}</div>`;
        }
        
        createModal(modalId, 'My Bookings', content, true);
        openModal(modalId);

        document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                myBookingsData = myBookingsData.filter(b => b.bookingId != e.target.dataset.bookingId);
                openMyBookingsModal();
                showToast('Booking cancelled.');
            });
        });
    };

    // --- GENERAL EVENT LISTENERS ---
    searchBar.addEventListener('input', e => { filterState.text = e.target.value; renderVenues(filterState); });
    document.getElementById('ai-filter-btn').addEventListener('click', openFilterModal);
    [document.getElementById('my-bookings-btn-desktop'), document.getElementById('my-bookings-btn-mobile')].forEach(btn => btn.addEventListener('click', openMyBookingsModal));
    document.getElementById('mobile-menu-button').addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));
    
    [document.getElementById('theme-toggle-desktop'), document.getElementById('theme-toggle-mobile')].forEach(btn => btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
        updateThemeIcons();
    }));
    
    const updateThemeIcons = () => {
        const isDark = document.documentElement.classList.contains('dark');
        ['desktop', 'mobile'].forEach(type => {
            document.getElementById(`theme-toggle-dark-icon-${type}`).classList.toggle('hidden', !isDark);
            document.getElementById(`theme-toggle-light-icon-${type}`).classList.toggle('hidden', isDark);
        });
    };
    updateThemeIcons();

    const showToast = (message) => {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').textContent = message;
        toast.classList.remove('opacity-0', 'translate-y-10');
        toast.classList.add('toast-enter');
        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('opacity-0', 'translate-y-10', 'toast-exit');
            setTimeout(() => toast.classList.remove('toast-exit'), 300);
        }, 3000);
    };

    // --- INITIAL RENDER ---
    renderVenues(filterState);
});
