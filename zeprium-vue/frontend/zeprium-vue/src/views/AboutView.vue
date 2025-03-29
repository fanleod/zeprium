<template>
  <div class="about">
    <main>
      <section class="about-hero">
        <div class="container">
          <h1>About Zeprium</h1>
          <p class="lead">We are a creative studio dedicated to bringing your digital ideas to life.</p>
        </div>
      </section>
      
      <section class="about-story">
        <div class="container">
          <div class="story-grid">
            <div class="story-image">
              <img src="@/assets/images/about-image.jpg" alt="Zeprium team working" />
            </div>
            <div class="story-content">
              <h2>Our Story</h2>
              <p>Zeprium was founded in 2020 with a simple mission: to create beautiful, functional, and accessible digital experiences that solve real problems.</p>
              <p>We believe in the power of technology to transform ideas into reality, and we're committed to helping our clients navigate the ever-changing digital landscape.</p>
              <p>Our team comes from diverse backgrounds, bringing together expertise in design, development, content creation, and marketing to deliver holistic solutions for businesses of all sizes.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="about-values">
        <div class="container">
          <h2 class="text-center">Our Values</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.</p>
            </div>
            
            <div class="value-card">
              <div class="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Collaboration</h3>
              <p>We work closely with our clients, building partnerships that lead to successful outcomes.</p>
            </div>
            
            <div class="value-card">
              <div class="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Quality</h3>
              <p>We're committed to excellence in everything we do, from design to development to support.</p>
            </div>
            
            <div class="value-card">
              <div class="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Accessibility</h3>
              <p>We believe digital experiences should be inclusive and accessible to everyone.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="about-team">
        <div class="container">
          <h2 class="text-center">Our Team</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-image">
                <img src="@/assets/images/team-member-1.jpg" alt="Team member" />
              </div>
              <h3>Jane Doe</h3>
              <p class="member-title">Creative Director</p>
              <p class="member-bio">Jane brings over 10 years of experience in design and creative leadership.</p>
            </div>
            
            <div class="team-member">
              <div class="member-image">
                <img src="@/assets/images/team-member-2.jpg" alt="Team member" />
              </div>
              <h3>John Smith</h3>
              <p class="member-title">Lead Developer</p>
              <p class="member-bio">John specializes in frontend development with expertise in Vue.js and React.</p>
            </div>
            
            <div class="team-member">
              <div class="member-image">
                <img src="@/assets/images/team-member-3.jpg" alt="Team member" />
              </div>
              <h3>Emily Chen</h3>
              <p class="member-title">Content Strategist</p>
              <p class="member-bio">Emily helps clients tell their stories through compelling digital content.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="about-cta">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to work with us?</h2>
            <p>Let's create something amazing together.</p>
            <router-link to="/contact" class="btn btn-primary">Get in Touch</router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about {
  /* About-specific styles */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

section {
  margin-bottom: 5rem;
  padding: 2rem 0;
}

.about-hero {
  text-align: center;
  padding: 3rem 0;
  background-color: #f9f9f9;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
}

.lead {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #666;
}

.text-center {
  text-align: center;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.story-image img {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.story-content p {
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.value-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.value-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  color: #333;
}

.value-card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
}

.value-card p {
  line-height: 1.6;
  color: #666;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.team-member {
  text-align: center;
}

.member-image {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-member h3 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
}

.member-title {
  color: #666;
  margin-bottom: 1rem;
  font-weight: 500;
}

.member-bio {
  color: #777;
  line-height: 1.6;
}

.about-cta {
  background-color: #f9f9f9;
  padding: 5rem 0;
  text-align: center;
}

.cta-content h2 {
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #333;
  color: white;
}

.btn-primary:hover {
  background-color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 响应式样式 */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  .lead {
    font-size: 1.2rem;
  }
  
  .story-grid {
    grid-template-columns: 1fr;
  }
  
  .story-image {
    margin-bottom: 2rem;
  }
}
</style> 