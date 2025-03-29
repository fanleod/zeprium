<template>
  <div class="contact">
    <main>
      <section class="contact-hero">
        <div class="container">
          <h1>Get in Touch</h1>
          <p class="lead">We'd love to hear from you. Fill out the form below or reach out through our contact information.</p>
        </div>
      </section>
      
      <section class="contact-content">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-form-container">
              <h2>Send Us a Message</h2>
              <form class="contact-form" @submit.prevent="submitForm">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name" 
                    placeholder="Your Name"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email" 
                    placeholder="your.email@example.com"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    v-model="form.subject" 
                    placeholder="What is this regarding?"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="message">Message</label>
                  <textarea 
                    id="message" 
                    v-model="form.message" 
                    placeholder="Your message here..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <div class="form-group form-submit">
                  <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                  </button>
                </div>
                
                <div v-if="formSuccess" class="form-success">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
                
                <div v-if="formError" class="form-error">
                  <p>{{ formError }}</p>
                </div>
              </form>
            </div>
            
            <div class="contact-info">
              <h2>Contact Information</h2>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h3>Address</h3>
                  <p>123 Creative Street</p>
                  <p>San Francisco, CA 94103</p>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90363 2.12788 3.62488 2.21649 3.36172C2.3051 3.09855 2.44756 2.85669 2.63476 2.6516C2.82196 2.44651 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83213 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23679 4.68007 9.47348 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5265 19.3199 14.7632 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h3>Phone</h3>
                  <p>+1 (415) 555-1234</p>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h3>Email</h3>
                  <p>info@zeprium.com</p>
                </div>
              </div>
              
              <div class="social-links">
                <h3>Follow Us</h3>
                <div class="social-icons">
                  <!-- Apple Podcast -->
                  <a href="https://podcasts.apple.com/" target="_blank" rel="noopener noreferrer" aria-label="Apple Podcast">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.7186 19.8095C11.0906 19.8095 9.75757 18.5043 9.75757 16.8695C9.75757 15.3233 10.9231 14.0957 12.3888 13.9481C12.4983 13.9394 12.6079 13.9348 12.7186 13.9348C12.8292 13.9348 12.9388 13.9394 13.0483 13.9481C14.5141 14.0957 15.6796 15.3233 15.6796 16.8695C15.6796 18.5043 14.3466 19.8095 12.7186 19.8095ZM8.66686 7.98702C8.66686 4.9325 10.8562 2.4 13.6942 2.4C16.5322 2.4 18.7215 4.9325 18.7215 7.98702C18.7215 10.2276 17.4945 12.1619 15.773 13.071C15.7502 12.6657 15.6699 12.2738 15.5365 11.8957C16.7173 11.1805 17.4907 9.69764 17.4907 7.98702C17.4907 5.6127 15.8245 3.70905 13.6942 3.70905C11.5638 3.70905 9.89769 5.6127 9.89769 7.98702C9.89769 9.69764 10.671 11.1805 11.8519 11.8957C11.7185 12.2738 11.6382 12.6657 11.6153 13.071C9.89388 12.1619 8.66686 10.2276 8.66686 7.98702ZM18.1745 20.4C18.1745 17.6229 15.7502 15.3676 12.7186 15.3676C9.68699 15.3676 7.26264 17.6229 7.26264 20.4H5.96411C5.96411 17.2929 8.43309 14.518 11.6154 14.0919C11.6154 14.0919 11.8482 14.0638 12.0962 14.0581C12.1122 14.0574 12.1287 14.057 12.1449 14.0567H12.7186H13.2922C13.3085 14.057 13.3249 14.0574 13.3409 14.0581C13.589 14.0638 13.8217 14.0919 13.8217 14.0919C17.004 14.518 19.473 17.2929 19.473 20.4H18.1745ZM12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 21.8182C6.57666 21.8182 2.18182 17.4234 2.18182 12C2.18182 6.57666 6.57666 2.18182 12 2.18182C17.4234 2.18182 21.8182 6.57666 21.8182 12C21.8182 17.4234 17.4234 21.8182 12 21.8182Z"/>
                    </svg>
                  </a>
                  <!-- YouTube -->
                  <a href="https://youtube.com/channel" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <!-- Xiaohongshu -->
                  <a href="https://xiaohongshu.com/user" target="_blank" rel="noopener noreferrer" aria-label="小红书 (Xiaohongshu)">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.256 7.913c.355.138.64.398.804.737.165.339.21.724.128 1.093-.232 1.239-1.539 2.205-3.249 2.416 1.502.763 2.566 2.021 2.931 3.467.1.397.083.813-.048 1.2a2.108 2.108 0 01-.673.963 2.272 2.272 0 01-1.078.484 2.292 2.292 0 01-1.172-.135c-.985-.405-1.756-1.396-2.074-2.639l-.327-1.27h-1.13l-.333 1.266c-.336 1.262-1.146 2.268-2.154 2.673-1.113.446-2.367-.03-2.787-1.054-.232-.57-.284-1.2-.146-1.8.367-1.59 1.566-2.969 3.193-3.707-1.68-.211-2.962-1.166-3.178-2.38-.108-.607.054-1.226.444-1.692a2.093 2.093 0 011.617-.741c1.245 0 2.358.85 2.805 2.068l.321 1.668h1.043l.302-1.563c.422-1.28 1.516-2.174 2.804-2.174.434 0 .844.122 1.213.317z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="contact-map">
        <div class="container">
          <h2 class="text-center">Find Us</h2>
          <div class="map-container">
            <!-- Placeholder for an actual map -->
            <div class="map-placeholder">
              <p>Map integration would be implemented here, using Google Maps, Mapbox, or a similar service.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      formSuccess: false,
      formError: null
    }
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      this.formSuccess = false;
      this.formError = null;
      
      try {
        // 这里将添加实际的表单提交逻辑
        // const response = await this.$http.post('/api/contact', this.form);
        
        // For demo purposes, we're just simulating a submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 重置表单
        this.form.name = '';
        this.form.email = '';
        this.form.subject = '';
        this.form.message = '';
        
        // 显示成功消息
        this.formSuccess = true;
      } catch (error) {
        this.formError = 'There was an error sending your message. Please try again.';
        console.error('Form submission error:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.contact {
  /* Contact-specific styles */
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

.contact-hero {
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

.contact-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 4rem;
}

/* Form Styles */
.contact-form-container h2 {
  margin-bottom: 2rem;
}

.contact-form {
  max-width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #333;
}

.form-submit {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #333;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-success, .form-error {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.25rem;
}

.form-success {
  background-color: rgba(0, 200, 83, 0.1);
  color: #00c853;
}

.form-error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Contact Info Styles */
.contact-info h2 {
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.info-icon {
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  color: #333;
}

.info-content h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.info-content p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.social-links h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.social-icons {
  display: flex;
  gap: 1.5rem;
}

.social-icons a {
  display: block;
  width: 40px;
  height: 40px;
  color: #333;
  transition: all 0.3s ease;
}

.social-icons a:hover {
  color: #000;
  transform: translateY(-3px);
}

/* Map Styles */
.map-container {
  height: 400px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #666;
  text-align: center;
  padding: 2rem;
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
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    margin-top: 3rem;
  }
}
</style> 