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
      'Strategic AI Integration: Spearheaded the end-to-end design and deployment of an AI-powered chatbot, reducing manual support tickets by 40% and significantly improving administrative response times',
      'SDLC Optimization: Boosted team coding efficiency and shortened project delivery cycles by 30% through the strategic integration of AI-assisted development tools and automated workflows.',
      'Infrastructure & Cloud Management: Orchestrated high-availability server environments on AWS and Digital Ocean, ensuring 99.9% uptime for client applications while supporting high-volume traffic.',
      'Database Architecture & Security: Engineered optimized database schemas and implemented rigorous security protocols for MySQL and PostgreSQL, mitigating vulnerabilities and ensuring data integrity across multiple platforms.',
      'Client Roadmap Execution: Led the translation of complex client requirements into scalable technical architectures, managing the full development lifecycle from initial specification to final deployment.',
      'Data Intelligence: Transformed raw operational data into actionable business insights by designing automated reporting pipelines and interactive dashboards using Google Looker Studio.',
      'Real-time System Development: Architected robust, real-time communication features using Socket.io, enhancing user engagement and system interactivity for enterprise-level applications.'
    ]
  },
  'senior-kritikal': {
    title: 'Senior Software Engineer',
    date: 'Dec 2020 — Nov 2021',
    company: 'Kritikal Solutions Pvt. Ltd. | India',
    points: [
      "Scalable Architecture Development: Engineered core backend modules for Byju’s, India's largest EdTech platform, optimizing system architecture to seamlessly handle high-volume traffic and massive datasets during peak usage.",
      "High-Performance API Integration: Designed and integrated secure, low-latency REST APIs, implementing advanced caching and security protocols to ensure 99.9% service availability and data protection.",
      "Workflow & Data Automation: Streamlined business intelligence operations by developing automated data processing pipelines, reducing manual reporting effort and accelerating time-to-insight for stakeholders.", 
      "System Optimization & Security: Refactored legacy backend components to improve query performance and database efficiency, ensuring the platform remained robust under the weight of large-scale enterprise data."
    ]
  },
  'senior-sassy': {
    title: 'Senior Software Engineer',
    date: 'Dec 2017 — Dec 2020',
    company: 'Sassy Infotech Pvt. Ltd. | India',
    points: [
      "Full-Stack API Development: Architected and deployed scalable RESTful APIs for cross-platform web and mobile applications using Node.js (TypeScript) and Laravel, ensuring high-performance server-side logic",
      "Real-Time System Engineering: Designed and integrated complex real-time communication modules utilizing Socket.io and Firebase, enabling seamless instant messaging and live data synchronization.",
      "Cloud Infrastructure Management: Orchestrated cloud environments on Digital Ocean, configuring and maintaining various Droplets to optimize resource allocation and application stability.",
      "Advanced Authentication & Security: Engineered secure user authentication flows and Role-Based Access Control (RBAC) using Firebase, ensuring granular security for sensitive user data.",
      "Database Collaboration & Optimization: Partnered with DBAs to manage and scale diverse database architectures, including MySQL, MongoDB, and Firebase, to support evolving project requirements.",
      "Server Configuration & DevOps: Streamlined development environments by configuring Ubuntu-based servers and remote client setups, tailoring infrastructure to specific deployment needs."
    ]
  },
  'junior': {
    title: 'Junior Software Engineer (Training)',
    date: 'Dec 2016 — Nov 2017',
    company: 'Wama Software | Ahmedabad',
    points: [
      "Cross-Platform API Development: Developed foundational REST APIs for web and mobile applications using Node.js and Laravel, gaining hands-on experience in full-stack architecture.",
      "Real-Time & Database Integration: Implemented real-time chat features using Socket.io and managed data across MongoDB, MySQL, and Firebase environments."
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