document.addEventListener("DOMContentLoaded", function () {
  
  
  
  function ajustarLayoutVista() {
  const imgEl = document.querySelector('.viewer-image img');
  const imageContainer = document.querySelector('.viewer-image');
  const textContainer = document.querySelector('.viewer-text');

  if (!imgEl || !imageContainer || !textContainer) return;

  imageContainer.classList.remove('horizontal', 'vertical');
  textContainer.classList.remove('horizontal', 'vertical');

  imgEl.onload = () => {
    const isVertical = imgEl.naturalHeight > imgEl.naturalWidth;

    if (isVertical) {
      imageContainer.classList.add('vertical');
      textContainer.classList.add('vertical');
    } else {
      imageContainer.classList.add('horizontal');
      textContainer.classList.add('horizontal');
    }
  };

  if (imgEl.complete) imgEl.onload();
}

  const sound = new Audio("https://raw.githubusercontent.com/parquerevelado-gif/soundeffects/main/Projector%20Slide%20Change%20Sound%20Effect%20%20%20HQ%20(mp3cut.net).mp3");

 const sheetID = "2PACX-1vRBo8Pv60vdGp_trawO9-sPbPqT-SAsdb29F7iPiHmvVvx62qpbNCzJxu4g4nZlNcpRv0A-fUvz5n4U";
const sheetURL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRBo8Pv60vdGp_trawO9-sPbPqT-SAsdb29F7iPiHmvVvx62qpbNCzJxu4g4nZlNcpRv0A-fUvz5n4U/pub?gid=0&single=true&output=csv`;

const marco = "https://i.postimg.cc/4Nr6QF1p/Diapo-crema-derecha-horizontal.png";

let images = [];

fetch(sheetURL)
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n").slice(1); // salteamos cabecera
    images = rows
      .map((row) => {
        const [src, thumb, desc, fecha] = row.split(",");
        return { src, thumb, desc, fecha };
      })
      .filter(img => img.src && img.thumb)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // orden descendente por fecha

    cargarMiniaturas(); // 👈 importante: disparar la creación
  });

  function cargarMiniaturas() {
  const gallery = document.getElementById("gallery");

  images.forEach((img, index) => {
    const thumb = document.createElement("div");
thumb.classList.add("slide-thumb");


    const preload = new Image();
    preload.src = img.thumb;

    preload.onload = () => {
      const isVertical = preload.naturalHeight > preload.naturalWidth;
      const orientationClass = isVertical ? "vertical" : "horizontal";
      const rotateClass = isVertical ? "rotate-frame" : "";

      thumb.innerHTML = `
        <div class="frame-wrapper">
          <div class="photo-mask">
            <img src="${img.thumb}" class="photo ${orientationClass}" />
          </div>
          <img src="${marco}" class="frame ${rotateClass}" />
        </div>
      `;

      thumb.addEventListener("click", () => openViewer(index));
      gallery.appendChild(thumb);
    };
  });
}


  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  const viewerDesc = document.getElementById("viewerDesc");
const viewerLayout = document.getElementById("viewerLayout");

  let currentIndex = 0;

// Crear miniaturas
images.forEach((img, index) => {
  const thumb = document.createElement("div");
  thumb.classList.add("slide-thumb");

  const preload = new Image();
  preload.src = img.thumb;

  preload.onload = () => {
    const isVertical = preload.naturalHeight > preload.naturalWidth;
    const orientationClass = isVertical ? "vertical" : "horizontal";
    const rotateClass = isVertical ? "rotate-frame" : "";

thumb.innerHTML = `
  <div class="frame-wrapper">
    <div class="photo-mask">
      <img src="${img.thumb}" class="photo ${orientationClass}" />
    </div>
    <div class="frame-container">
      <img src="${marco}" class="frame ${rotateClass}" />
    </div>
  </div>
`;


    thumb.addEventListener("click", () => openViewer(index));
    gallery.appendChild(thumb);
  };
   
});
  


  function openViewer(index) {
    currentIndex = index;
    updateViewer();
    viewer.classList.add("active");

    sound.currentTime = 0;
    sound.play();
    
    
  }

function updateViewer(direction = "left") {
  // Aseguramos que la imagen actual tenga fade-out y slide
  viewerImg.classList.remove("fade-in", "fade-out", "slide-left", "slide-right");

  // Animación de salida (foto actual)
  viewerImg.classList.add("fade-out", direction === "left" ? "slide-left" : "slide-right");

  // Esperamos a que termine la animación de salida
  setTimeout(() => {
    // Cambiar imagen y descripción
viewerImg.src = images[currentIndex].src;
viewerDesc.textContent = images[currentIndex].desc;
viewer.classList.add('active');
    
    viewerImg.onload = function () {
  const isVertical = viewerImg.naturalHeight > viewerImg.naturalWidth;
  const layout = document.getElementById("viewerLayout");

  if (isVertical) {
    layout.classList.add("vertical-img");
  } else {
    layout.classList.remove("vertical-img");
  }
};


ajustarLayoutVista();

    const isVertical = viewerImg.naturalHeight > viewerImg.naturalWidth;
const viewerLayout = document.querySelector('.viewer-layout');
viewerLayout.classList.remove("vertical", "horizontal");
viewerLayout.classList.add(isVertical ? "vertical" : "horizontal");


    
    // Reiniciar animaciones
    viewerImg.classList.remove("fade-out", "slide-left", "slide-right");

    // Animación de entrada
    viewerImg.classList.add("fade-in");

    // Eliminar clase para que se pueda volver a usar
    setTimeout(() => {
      viewerImg.classList.remove("fade-in");
    }, 300);
  }, 250);

  // Sonido
  sound.currentTime = 0;
  sound.play();
}


function animateSlide(direction) {
  // Quitar clases previas
  viewerImg.classList.remove("slide-left", "slide-right", "fade-in");

  // Aplicar clase según dirección
  if (direction === "left") {
    viewerImg.classList.add("slide-left");
  } else {
    viewerImg.classList.add("slide-right");
  }

  // Reproducir sonido
  sound.currentTime = 0;
  sound.play();

  // Esperar la animación antes de actualizar imagen
  setTimeout(() => {
    updateViewer();

    // Volver a fade-in desde la dirección opuesta
    viewerImg.classList.remove("slide-left", "slide-right");
    viewerImg.classList.add("fade-in");

    // Limpiar después
    setTimeout(() => {
      viewerImg.classList.remove("fade-in");
    }, 300);
  }, 300);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  animateSlide("left");
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  animateSlide("right");
}


  function closeViewer() {
    viewer.classList.remove("active");
  }

  function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  updateViewer("left");
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateViewer("right");
}


  function animateSlide() {
    viewerImg.classList.add("fade-out");

    setTimeout(() => {
      updateViewer();
    }, 200);

    sound.currentTime = 0;
    sound.play();
  }

  window.closeViewer = closeViewer;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  
  window.closeViewer = closeViewer;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  // Pantalla completa
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  fullscreenBtn.addEventListener("click", () => {
    const viewerEl = document.getElementById("viewer");

    if (!document.fullscreenElement) {
      viewerEl.requestFullscreen().catch((err) => {
        alert(`Error al activar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });
  
  
// 👉 Navegación con flechas del teclado
document.addEventListener("keydown", function (e) {
  const isViewerActive = viewer.classList.contains("active");

  if (!isViewerActive) return;

  if (e.key === "ArrowLeft") {
    prevSlide();
  } else if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "Escape") {
    closeViewer(); // opcional: cerrar con ESC
  }
});

});

