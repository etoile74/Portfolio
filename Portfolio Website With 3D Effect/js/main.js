//#################### Swiper ######################################################################
let mySwiper; 
let currentSlide = 0;
const slides = document.querySelectorAll(".swiper-slide");

// Fonction pour initialiser selon l'écran
function initializeMySwiper() {
  if (window.innerWidth > 1024) {
    // Version desktop avec Swiper
    if (!mySwiper) {
      mySwiper = new Swiper(".swiper", {
        effect: "cube",
        allowTouchMove: false,
        grabCursor: false,
        cubeEffect: {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
        mousewheel: true,
      });

      // Liens aside pour desktop
      setupAsideNavigation();

      mySwiper.on("slideChange", () => {
        updateActiveLink(mySwiper.activeIndex);
      });
    }
  } else {
    // Version mobile sans swiper
    if (mySwiper) {
      mySwiper.destroy(true, true); // désactive swiper
      mySwiper = null;
    }
    showSlide(currentSlide);
  }
}

function Navigate(index) {
  if (mySwiper) {
    // Desktop
    mySwiper.slideTo(index, 1000);
  } else {
    // Mobile
    currentSlide = index;
    showSlide(currentSlide);
  }
}

// Fonction pour afficher une slide manuellement
function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.display = "block";
    } else {
      slide.style.display = "none";
    }
  });
    // ➜ mise à jour de l’état des boutons
    updateNavButtons();
}

  // ➜ mise à jour de l’état des boutons

function updateNavButtons() {
  if (!prevBtn || !nextBtn) return;

  // Désactive prev si on est à la première slide
  if (currentSlide === 0) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = "0.5";
    prevBtn.style.cursor = "not-allowed";
  } else {
    prevBtn.disabled = false;
    prevBtn.style.opacity = "1";
    prevBtn.style.cursor = "pointer";
  }

  // Désactive next si on est à la dernière slide ("Me Contacter")
  if (currentSlide === slides.length - 1) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";
  } else {
    nextBtn.disabled = false;
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }
}

// Navigation avec les flèches
const prevBtn = document.getElementById("prev-slide");
const nextBtn = document.getElementById("next-slide");

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });
}

// Navigation aside pour desktop
function setupAsideNavigation() {
  const links = document.querySelectorAll(".Links li"); // Tous les liens du aside
  links.forEach((link, index) => {
    link.addEventListener("click", () => {
      if (mySwiper) {
        mySwiper.slideTo(index, 1000);
      }
    });
  });
}

function updateActiveLink(index) {
  const links = document.querySelectorAll(".Links li");
  links.forEach((link, i) => {
    link.classList.toggle("activeLink", i === index);
  });
}

// Initialisation
initializeMySwiper();
window.addEventListener("resize", initializeMySwiper);
//##################################################################################################



//################## loader animation ##################################
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => loader.remove(), 500); // temps de transition avant suppression
    }, 2000); // ⬅️ durée en ms (ici 3 secondes)
  }
});
//######################################################################



//############### Webhook Discord ##################################################################
// Webhook Discord simple en JS
document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        alert("Veuillez remplir tous les champs avant d'envoyer.");
        return;
    }

    const webhookURL = "https://discord.com/api/webhooks/1505854533215977555/S0SfowWigKtm81Q18cUMCsJkuCPWtlOYfeWUWmkbSl6QJnom_Wrr6faZMKDl-SybtO6M";
    

    const payload = {
        embeds: [
            {
                title: "Nouveau message reçu",
                color: 0x5865F2,
                fields: [
                    {
                        name: "Nom",
                        value: name || "Non renseigné",
                        inline: true
                    },
                    {
                        name: "Email",
                        value: email || "Non renseigné",
                        inline: true
                    },
                    {
                        name: "Message",
                        value: message.length > 1024 ? message.slice(0, 1021) + "..." : message,
                        inline: false
                    }
                ],
                footer: {
                    text: "Message envoyé le " + new Date().toLocaleString()
                },
            }
        ]
    };
    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Message envoyé avec succès !");
            document.getElementById('contactForm').reset();
        } else {
            alert("Erreur lors de l'envoi du message.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
    }
});
//###############################################################################################




//####################### Modal galery section #####################################################

const galleryProjects = document.querySelectorAll('.swiper-slide.gallery:not(.swiper-slide-duplicate) .project');

// Fonction pour ouvrir la modale gallery
function openGalleryModal(title, description, zipUrl = null, images = []) {
    document.getElementById('gallery-title').innerText = title;
    document.getElementById('gallery-description').innerText = description || "Aucune description";

    // Gestion du bouton de téléchargement ZIP
    let downloadDiv = document.getElementById('gallery-download');
    if (!downloadDiv) {
        downloadDiv = document.createElement('div');
        downloadDiv.id = 'gallery-download';
        document.querySelector('#gallery-modal .modal-content').appendChild(downloadDiv);
    }
    if (zipUrl) {
        downloadDiv.innerHTML = `<a href="${zipUrl}" download class="modal-download">Télécharger le dossier (.zip)</a>`;
    } else {
        downloadDiv.innerHTML = '';
    }

    // Gestion des images annexes (loisirs, projets, etc)
    let imagesDiv = document.getElementById('gallery-images');
    if (!imagesDiv) {
        imagesDiv = document.createElement('div');
        imagesDiv.id = 'gallery-images';
        document.querySelector('#gallery-modal .modal-content').appendChild(imagesDiv);
    }
    if (images.length > 0) {
        imagesDiv.innerHTML = images.map(url => `<img src="${url}" class="modal-extra-img" alt="Image annexe">`).join('');
    } else {
        imagesDiv.innerHTML = '';
    }

    document.getElementById('gallery-modal').classList.add('show');
}

// Fonction pour fermer la modale
function closeGalleryModal() {
  document.getElementById('gallery-modal').classList.remove('show');
}

// Attache les événements sur l'image et le titre de chaque projet
galleryProjects.forEach(item => {
  const img = item.querySelector('img');
  const titleElement = item.querySelector('h2');
  const description = item.getAttribute('data-description');
  const title = titleElement ? titleElement.innerText : "";

    // Cas pour "Mes Projects" avec fichier .zip et pas d'image supplémentaire :
    if(title === "Mes Projects") {
        if (img) img.addEventListener('click', () =>
            openGalleryModal(title, description, 'sae 105.zip')
        );
        if (titleElement) titleElement.addEventListener('click', () =>
            openGalleryModal(title, description, 'sae 105.zip')
        );
    }
    // Cas pour "Mes Loisirs" avec images annexes et pas de fichier à télécharger :
    else if(title === "Mes Loisirs") {
        const imageArray = [
            "img/loisir1.jpg",
            "img/loisir2.jpg"
            // Ajoute d'autres liens image ici si besoin
        ];
        if(img) img.addEventListener('click', () =>
            openGalleryModal(title, description, null, imageArray)
        );
        if(titleElement) titleElement.addEventListener('click', () =>
            openGalleryModal(title, description, null, imageArray)
        );
    }
    // Cas général (affiche juste la description)
    else {
        if(img) img.addEventListener('click', () =>
            openGalleryModal(title, description)
        );
        if(titleElement) titleElement.addEventListener('click', () =>
            openGalleryModal(title, description)
        );
    }
});

// Clic sur la croix ferme le modal
document.getElementById('close-gallery-modal').addEventListener('click', closeGalleryModal);

// Fermer en cliquant en dehors du contenu
window.addEventListener('mousedown', (e) => {
  const modal = document.getElementById('gallery-modal');
  if (e.target === modal) {
    closeGalleryModal();
  }
});




//###############################################################################################

  
//############## Modale Compétences #############################################################
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
  item.addEventListener('click', () => {
    const title = item.querySelector('p').innerText;
    const description = item.getAttribute('data-description');

    document.getElementById('skill-title').innerText = title;
    document.getElementById('skill-description').innerText = description;

    document.getElementById('skill-modal').classList.add('show');
  });
});

function closeSkillModal() {
  document.getElementById('skill-modal').classList.remove('show');
}

// Fermer si clic en dehors de la modale
window.addEventListener('click', (e) => {
  const modal = document.getElementById('skill-modal');
  if (e.target === modal) {
    closeSkillModal();
  }
});


//###############################################################################################


// ################## Dark/Light Mode #######################################
const btn = document.createElement("div");
btn.classList.add("theme-toggle");

// Charger le thème sauvegardé
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// Fonction toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");

  btn.setAttribute("title", isLight ? "Dark mode" : "Light mode");
}
btn.addEventListener("click", toggleTheme);

// Fonction pour placer le bouton au bon endroit
function placeThemeButton() {
  const pcContainer = document.getElementById("theme-toggle-container-pc");
  const mobileContainer = document.getElementById("theme-toggle-container-mobile");

  if (window.innerWidth > 1024) {
    // Mode PC → dans aside
    if (!pcContainer.contains(btn)) {
      mobileContainer.innerHTML = "";
      pcContainer.appendChild(btn);
    }
  } else {
    // Mode mobile/tablette → dans HomeContent
    if (!mobileContainer.contains(btn)) {
      pcContainer.innerHTML = "";
      mobileContainer.appendChild(btn);
    }
  }
}

// Initial placement
placeThemeButton();

// Replacer à chaque resize
window.addEventListener("resize", placeThemeButton);

btn.classList.add("theme-toggle");
btn.setAttribute("title", "Dark mode");


//###############################################################################################