// Filters
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active state
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterButtons.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxBody = document.querySelector('.lightbox-body');
const closeBtn = document.querySelector('.lightbox-close');

function openLightbox(contentEl) {
  // Clear previous
  lightboxBody.innerHTML = '';
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
  lightboxBody.appendChild(contentEl);
  lightbox.focus();
}

function closeLightbox() {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // remove any iframe/video to stop playback
  lightboxBody.innerHTML = '';
}

// Open from play buttons
document.querySelectorAll('.play').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const type = btn.dataset.videoType;
    const src = btn.dataset.videoSrc;

    if (type === 'youtube' || type === 'vimeo') {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.src = src;
      openLightbox(iframe);
    } else if (type === 'local') {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      video.appendChild(source);
      openLightbox(video);
    }
  });
});

// Keyboard and overlay close
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('show')) {
    closeLightbox();
  }
});

// Accessibility: open video with Enter when card focused
cards.forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const play = card.querySelector('.play');
      if (play) play.click();
    }
  });
});
