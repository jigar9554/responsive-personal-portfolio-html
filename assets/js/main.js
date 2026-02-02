lucide.createIcons();

// Slider logic
const track = document.getElementById('sliderTrack');
const container = document.getElementById('sliderContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let startX, currentTranslate, prevTranslate, isDragging = false;

function updateSlider() {
  const slideWidth = track.querySelector('.slider-slide').clientWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  const maxIndex = track.children.length - 1;
  prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
  nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
}

nextBtn.addEventListener('click', () => {
  const maxIndex = track.children.length - 1;
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateSlider();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

container.addEventListener('mousedown', dragStart);
container.addEventListener('touchstart', dragStart);
container.addEventListener('mouseup', dragEnd);
container.addEventListener('touchend', dragEnd);
container.addEventListener('mousemove', dragMove);
container.addEventListener('touchmove', dragMove);

function dragStart(e) {
  isDragging = true;
  startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  track.style.transition = 'none';
}

function dragMove(e) {
  if (!isDragging) return;
  const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  const diff = currentX - startX;
  const slideWidth = track.querySelector('.slider-slide').clientWidth;
  const translate = (-currentIndex * slideWidth) + diff;
  track.style.transform = `translateX(${translate}px)`;
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';

  const slideWidth = track.querySelector('.slider-slide').clientWidth;
  const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (Math.abs(diff) > slideWidth / 4) {
    if (diff < 0) {
      const maxIndex = track.children.length - 1;
      if (currentIndex < maxIndex) currentIndex++;
    } else {
      if (currentIndex > 0) currentIndex--;
    }
  }
  updateSlider();
}

window.addEventListener('resize', updateSlider);
updateSlider();

// Intersection Observer for Modern Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate__animated', 'animate__fadeInUp');
      entry.target.style.opacity = '1';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});

// Prevent browser from restoring scroll position on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;

  // Close mobile menu if open
  const menu = document.getElementById('mobile-menu');
  if (menu && !menu.classList.contains('hidden')) {
    toggleMobileMenu();
  }

  const headerOffset = window.innerWidth < 768 ? 100 : 150;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
  // Re-initialize icons when menu becomes visible (icons in hidden elements may not render)
  if (!menu.classList.contains('hidden') && typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}


function handleSubmit() {
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitBtnText');
  const btnLoader = document.getElementById('submitBtnLoader');
  const feedback = document.getElementById('feedback');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Show loader, hide text
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  btnLoader.classList.add('flex');
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Google Apps Script URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwvp0qW9Kmy5L0EHg-QLpN5BfMUKCYgCi3_zXJrogYgRKGNv-jAYhCnLGYCOw0uxJDfpw/exec';

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);

  fetch(scriptURL, {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  })
    .then(response => {
      document.getElementById('contactForm').reset();
      btn.classList.add('hidden');
      feedback.classList.remove('hidden');
      feedback.textContent = 'Message sent successfully!';
      feedback.classList.remove('text-red-500');
      feedback.classList.add('text-green-400');
    })
    .catch(error => {
      btn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      btnLoader.classList.remove('flex');
      feedback.classList.remove('hidden');
      feedback.textContent = 'Error! Please check console.';
      feedback.classList.remove('text-green-400');
      feedback.classList.add('text-red-500');
      console.error('Error!', error.message);
    });
}


// Experience Modal Logic
const experienceData = {
  'lead': {
    title: 'Software Engineer – Lead',
    date: 'Nov 2021 — PRESENT',
    company: 'Crest Info Systems Pvt. Ltd. | India',
    points: [
      'AI Implementation: Designed and deployed an AI-powered chat-bot to assist customers and the administration team, significantly improving support efficiency.',
      'Development Optimization: Integrated AI tools into the development workflow to accelerate project timelines and coding efficiency.',
      'Direct the implementation of websites based on specific client requirements and project specifications.',
      'Manage client servers and oversee projects utilizing various database structures to ensure operational stability.',
      'Developed optimized database schemas and migration structures across multiple platforms.',
      'Implement robust security measures for databases, specifically securing MySQL environments.',
      'Generate comprehensive analytics and reports using Google Studio.'
    ]
  },
  'senior-kritikal': {
    title: 'Senior Software Engineer',
    date: 'Dec 2020 — Nov 2021',
    company: 'Kritikal Solutions Pvt. Ltd. | India',
    points: [
      'Developed backend modules for Byju’s, India’s largest EdTech product.',
      'Built and integrated REST APIs while ensuring security and high performance.',
      'Automated data processing and reporting workflows for improved business insights.',
      'Improved backend architecture to support high-volume traffic and large datasets.'
    ]
  },
  'senior-sassy': {
    title: 'Senior Software Engineer',
    date: 'Dec 2017 — Dec 2020',
    company: 'Sassy Infotech Pvt. Ltd. | India',
    points: [
      'Configured remote clients and local Ubuntu-based servers, tailoring setups to meet specific project requirements',
      'Managed server infrastructure on Digital Ocean, including the configuration of various droplets.',
      'Developed REST APIs for web and mobile applications using Node JS (with TypeScript) and Laravel.',
      'Implemented real-time chat modules using Socket.io and Firebase Console.',
      'Built authentication flows and role-based access using Firebase.',
      'Collaborated closely with Database Administrators to manage MySQL, MongoDB, and Firebase databases.'
    ]
  },
  'junior': {
    title: 'Junior Software Engineer (Training)',
    date: 'Dec 2016 — Nov 2017',
    company: 'Wama Software | Ahmedabad',
    points: [
      'Created REST APIs for web and mobile platforms utilizing Node JS and Laravel.',
      'Implemented chat functionality using Socket.io and worked with MongoDB, MySQL, and Firebase.'
    ]
  }
};

function openExperienceModal(id) {
  const data = experienceData[id];
  if (!data) return;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDate').textContent = data.date;
  document.getElementById('modalCompany').textContent = data.company;

  const contentList = document.getElementById('modalContent');
  contentList.innerHTML = data.points.map(point =>
    `<li class="flex items-start gap-3">
            <i data-lucide="check-circle-2" class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"></i>
            <span>${point}</span>
        </li>`
  ).join('');

  // Re-initialize icons for the new content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const modal = document.getElementById('experienceModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeExperienceModal() {
  const modal = document.getElementById('experienceModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeExperienceModal();
});