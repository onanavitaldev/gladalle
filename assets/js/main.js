    const { createApp, ref, computed, onMounted, nextTick } = Vue;

    createApp({
        setup() {
            const currentIndex = ref(1);
            const selectedCat = ref('Tous');
            const searchCity = ref('');
            const modalOpen = ref(false);
            const modalItem = ref(null);

            // États pour la modale de détails produit
            const selectedProduct = ref(null);
            const selectedSize = ref('double');
            const isMenuFormula = ref(false);
            const sizeLabels = { single: 'Simple', double: 'Double', triple: 'Triple' };

            // Les 3 Burgers du Carrousel Principal avec leurs détails complets
            const popularBurgers = ref([
                {
                    name: 'LE CLASSIC SMASH',
                    tag: 'CLASSIC',
                    category: 'Burger Smash',
                    stickerBg: 'bg-cobalt',
                    ingredients: 'POTATO BUN, STEAK HALAL SMASHÉ, CHEDDAR AFFINÉ, OIGNONS DÉS, KETCHUP, MOUTARDE.',
                    fullDesc: 'L’essence même du smash burger américain revisité à la sauce G La Dalle : un potato bun toasté au beurre, une viande fraîche halal smashée sur plaque brûlante pour une croûte caramélisée (réaction de Maillard), cheddar fondant, oignons ciselés, ketchup et moutarde douce.',
                    prices: { single: '8.50€', double: '10.50€', triple: '12.50€' },
                    nutrition: { kcal: '620 kcal', protein: '36g', carbs: '48g', fat: '29g' },
                    allergens: 'Gluten (blé), Lait, Moutarde, Sésame.',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85'
                },
                {
                    name: 'LE FANCY DALLE',
                    tag: 'FANCY',
                    category: 'Signature Burger',
                    stickerBg: 'bg-cobalt',
                    ingredients: 'POTATO BUN, DOUBLE STEAK SMASHÉ HALAL, SALADE CROQUANTE, TOMATES, OIGNONS, CHEDDAR FONDU, SAUCE SECRÈTE G.',
                    fullDesc: 'Notre best-seller absolu depuis Nanterre. Un équilibre parfait entre fraîcheur (salade iceberg croquante, tranches de tomates mûres, oignons rouges) et gourmandise extrême grâce au double steak halal smashé, double cheddar affiné et notre sauce secrète G.',
                    prices: { single: '9.50€', double: '11.90€', triple: '13.90€' },
                    nutrition: { kcal: '760 kcal', protein: '45g', carbs: '52g', fat: '38g' },
                    allergens: 'Gluten (blé), Lait, Œuf, Moutarde, Sésame.',
                    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=85'
                },
                {
                    name: 'L’OKLAHOMA STREET',
                    tag: 'OKLAHOMA',
                    category: 'Burger Smash',
                    stickerBg: 'bg-ketchup',
                    ingredients: 'POTATO BUN, OIGNONS FINS SMASHÉS DANS LE STEAK HALAL, DOUBLE CHEDDAR, MAYONNAISE MAISON.',
                    fullDesc: 'Inspiré de la recette historique d’Oklahoma : une montagne d’oignons blancs coupés ultra-finement et directement pressés dans la viande halal sur le grill, recouverts de cheddar fondant et d’une mayonnaise onctueuse maison.',
                    prices: { single: '9.00€', double: '11.50€', triple: '13.50€' },
                    nutrition: { kcal: '710 kcal', protein: '41g', carbs: '50g', fat: '35g' },
                    allergens: 'Gluten (blé), Lait, Œuf, Sésame.',
                    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=85'
                }
            ]);

            const currentBurger = computed(() => popularBurgers.value[currentIndex.value]);
            const prevBurger = computed(() => {
                const idx = (currentIndex.value - 1 + popularBurgers.value.length) % popularBurgers.value.length;
                return popularBurgers.value[idx];
            });
            const nextBurger = computed(() => {
                const idx = (currentIndex.value + 1) % popularBurgers.value.length;
                return popularBurgers.value[idx];
            });

            const animateBurgerChange = () => {
                gsap.fromTo('.hero-center-burger img', 
                    { scale: 0.88, opacity: 0.5 }, 
                    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
                );
            };

            const prevSlide = () => {
                currentIndex.value = (currentIndex.value - 1 + popularBurgers.value.length) % popularBurgers.value.length;
                animateBurgerChange();
            };

            const nextSlide = () => {
                currentIndex.value = (currentIndex.value + 1) % popularBurgers.value.length;
                animateBurgerChange();
            };

            // Carte complète avec fiches détaillées
            const fullMenu = ref([
                { 
                    id: 1, name: 'DALLE DU MOMENT : BACON RANCH', category: 'Dalle du Moment', price: '11.90€', badge: 'Édition Limitée', 
                    desc: 'Double steak halal, bacon de dinde grillé, cheddar, oignons frits et sauce ranch.',
                    fullDesc: 'Recette saisonnière exclusive : deux steaks smashés halal, tranches de bacon de dinde fumé croustillantes, double cheddar fondu, oignons frits dorés et sauce ranch crémeuse aux herbes.',
                    nutrition: { kcal: '840 kcal', protein: '49g', carbs: '55g', fat: '44g' },
                    allergens: 'Gluten (blé), Lait, Œuf, Moutarde.',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80' 
                },
                { 
                    id: 2, name: 'LE SUPREME CHICKEN', category: 'Burgers', price: '9.50€', badge: 'Best-Seller', 
                    desc: 'Poulet pané croustillant mariné, cheddar, salade iceberg, pickles et sauce poivre.',
                    fullDesc: 'Filet de poulet entier mariné 24h aux épices maison et pané à la commande pour un croustillant maximal. Servi avec cheddar affiné, salade iceberg, cornichons américains et sauce au poivre.',
                    nutrition: { kcal: '690 kcal', protein: '38g', carbs: '61g', fat: '31g' },
                    allergens: 'Gluten (blé), Lait, Œuf, Céleri.',
                    image: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=700&q=80' 
                },
                { 
                    id: 3, name: 'LE TRIPLE SMASH XL', category: 'Burgers', price: '13.50€', badge: null, 
                    desc: 'Trois steaks smashés halal, triple cheddar affiné, cornichons et sauce signature.',
                    fullDesc: 'Réservé aux grosses dalles : trois steaks halal smashés sur plaque chaude, trois tranches de cheddar fondant entre chaque étage, pickles croquants et sauce G.',
                    nutrition: { kcal: '980 kcal', protein: '64g', carbs: '51g', fat: '56g' },
                    allergens: 'Gluten (blé), Lait, Œuf, Moutarde.',
                    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=700&q=80' 
                },
                { 
                    id: 4, name: 'FRITES CHEDDAR & OIGNONS', category: 'Frites & Sides', price: '4.90€', badge: null, 
                    desc: 'Frites croustillantes nappées de sauce cheddar chaude maison et oignons frits.',
                    fullDesc: 'Portion généreuse de frites dorées servies brûlantes avec notre nappage crémeux au cheddar affiné et une pluie d’oignons frits croustillants.',
                    nutrition: { kcal: '510 kcal', protein: '11g', carbs: '58g', fat: '26g' },
                    allergens: 'Lait, Gluten (oignons frits).',
                    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=700&q=80' 
                },
                { 
                    id: 5, name: 'BOX TENDERS HALAL (6 PCS)', category: 'Frites & Sides', price: '7.50€', badge: 'Croustillant', 
                    desc: 'Aiguillettes de poulet panées minutes servies avec 2 sauces au choix.',
                    fullDesc: '6 véritables aiguillettes de filet de poulet halal ultra-tendres à l’intérieur et croustillantes à l’extérieur. Accompagnées de deux sauces maison au choix (Barbecue, Algérienne, Ranch, Samouraï).',
                    nutrition: { kcal: '540 kcal', protein: '42g', carbs: '34g', fat: '25g' },
                    allergens: 'Gluten (blé), Œuf, Moutarde.',
                    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80' 
                },
                { 
                    id: 6, name: 'TIRAMISU SPECULOOS', category: 'Desserts', price: '3.90€', badge: 'Maison', 
                    desc: 'Crème mascarpone onctueuse et éclats de biscuits Speculoos caramélisés.',
                    fullDesc: 'Préparé chaque matin dans nos restaurants : mousse légère au mascarpone vanillé, biscuits imbibés et généreuse couche de Speculoos concassés.',
                    nutrition: { kcal: '420 kcal', protein: '7g', carbs: '46g', fat: '23g' },
                    allergens: 'Lait, Œuf, Gluten (blé), Soja.',
                    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80' 
                }
            ]);

            const filteredFullMenu = computed(() => {
                if (selectedCat.value === 'Tous') return fullMenu.value;
                return fullMenu.value.filter(i => i.category === selectedCat.value);
            });

            // Calcul dynamique du prix dans la fiche produit
            const currentDetailPrice = computed(() => {
                if (!selectedProduct.value) return '';
                let baseStr = selectedProduct.value.prices 
                    ? selectedProduct.value.prices[selectedSize.value] 
                    : selectedProduct.value.price;
                let numeric = parseFloat(baseStr.replace('€', '').trim());
                if (isMenuFormula.value) numeric += 2.50;
                return numeric.toFixed(2) + '€';
            });

            const openProductDetail = (product) => {
                selectedProduct.value = product;
                selectedSize.value = 'double';
                isMenuFormula.value = false;
                nextTick(() => lucide.createIcons());
            };

            const proceedFromDetail = () => {
                const p = selectedProduct.value;
                const sizeText = p.prices ? ` (${sizeLabels[selectedSize.value]})` : '';
                const formulaText = isMenuFormula.value ? ' + Menu Frites/Boisson' : ' (Seul)';
                const summary = `${p.name}${sizeText}${formulaText} — ${currentDetailPrice.value}`;
                selectedProduct.value = null;
                openOrderModal(summary);
            };

            // Restaurants
            const restaurants = ref([
                { name: 'G La Dalle — Nanterre (Historique)', address: '92000 Nanterre (Île-de-France)', hours: 'Ouvert jusqu’à 02h' },
                { name: 'G La Dalle — Bordeaux Centre', address: '33000 Bordeaux', hours: 'Ouvert jusqu’à 01h30' },
                { name: 'G La Dalle — Rouen', address: '76000 Rouen', hours: 'Ouvert jusqu’à 01h' },
                { name: 'G La Dalle — Roubaix (68e Resto)', address: '59100 Roubaix', hours: 'Ouvert jusqu’à 01h30' },
                { name: 'G La Dalle — Saint-Denis (La Réunion)', address: '97400 Saint-Denis', hours: 'Ouvert jusqu’à 23h30' }
            ]);

            const filteredRestaurants = computed(() => {
                if (!searchCity.value.trim()) return restaurants.value;
                const q = searchCity.value.toLowerCase();
                return restaurants.value.filter(r => r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q));
            });

            const openOrderModal = (item) => {
                modalItem.value = item;
                modalOpen.value = true;
                nextTick(() => lucide.createIcons());
            };

            onMounted(() => {
                lucide.createIcons();
                gsap.from('.hero-center-burger', {
                    y: 25,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });

            return {
                currentBurger,
                prevBurger,
                nextBurger,
                prevSlide,
                nextSlide,
                selectedCat,
                filteredFullMenu,
                searchCity,
                filteredRestaurants,
                modalOpen,
                modalItem,
                openOrderModal,
                selectedProduct,
                selectedSize,
                sizeLabels,
                isMenuFormula,
                currentDetailPrice,
                openProductDetail,
                proceedFromDetail
            };
        }
    }).mount('#app');