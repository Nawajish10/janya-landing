const VIDEO_CONFIG = [
  {
    id: "Zv_fBDLmjao",
    title: "Complete IVF Procedure & Treatment Guide",
    url: "https://youtu.be/Zv_fBDLmjao?si=FoTeSE49FRtTVGCM",
    thumbnail: "https://i.ytimg.com/vi/Zv_fBDLmjao/hqdefault.jpg"
  },
  {
    id: "FCA4Z3PR3LI",
    title: "Fertility Care & Pre-Treatment Advice",
    url: "https://youtu.be/FCA4Z3PR3LI?si=85bxevoaipk1L4gx",
    thumbnail: "https://i.ytimg.com/vi/FCA4Z3PR3LI/hqdefault.jpg"
  },
  {
    id: "8XYjU-dGe-0",
    title: "IVF Success & Complete Parenthood Journey",
    url: "https://youtu.be/8XYjU-dGe-0?si=SnX9fg-WMY_m5VlE",
    thumbnail: "https://i.ytimg.com/vi/8XYjU-dGe-0/hqdefault.jpg"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const videoGrid = document.getElementById('video-grid');
  if (!videoGrid) return;

  // Render videos if container is empty
  if (videoGrid.children.length === 0) {
    videoGrid.innerHTML = VIDEO_CONFIG.map((video) => `
      <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="card video-card anim-hover-lift" style="text-decoration: none;">
        <div class="video-card__thumbnail">
          <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" decoding="async" width="480" height="360">
          <div class="video-card__play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="video-card__content">
          <h3 class="video-card__title">${video.title}</h3>
          <div class="video-card__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span>Watch on YouTube</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </div>
        </div>
      </a>
    `).join('');
  }
});
