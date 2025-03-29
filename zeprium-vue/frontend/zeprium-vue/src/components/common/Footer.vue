<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="@/assets/images/zeprium-logo.png" alt="Zeprium Logo" class="footer-logo-img" />
      </div>
      <div class="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/about">About</router-link>
          </li>
          <li>
            <router-link to="/blog">Blog</router-link>
          </li>
          <li>
            <router-link to="/contact">Contact</router-link>
          </li>
        </ul>
      </div>
      <div class="footer-social">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="https://podcasts.apple.com/" target="_blank" rel="noopener noreferrer" aria-label="Apple Podcast">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M12.7186 19.8095C11.0906 19.8095 9.75757 18.5043 9.75757 16.8695C9.75757 15.3233 10.9231 14.0957 12.3888 13.9481C12.4983 13.9394 12.6079 13.9348 12.7186 13.9348C12.8292 13.9348 12.9388 13.9394 13.0483 13.9481C14.5141 14.0957 15.6796 15.3233 15.6796 16.8695C15.6796 18.5043 14.3466 19.8095 12.7186 19.8095ZM8.66686 7.98702C8.66686 4.9325 10.8562 2.4 13.6942 2.4C16.5322 2.4 18.7215 4.9325 18.7215 7.98702C18.7215 10.2276 17.4945 12.1619 15.773 13.071C15.7502 12.6657 15.6699 12.2738 15.5365 11.8957C16.7173 11.1805 17.4907 9.69764 17.4907 7.98702C17.4907 5.6127 15.8245 3.70905 13.6942 3.70905C11.5638 3.70905 9.89769 5.6127 9.89769 7.98702C9.89769 9.69764 10.671 11.1805 11.8519 11.8957C11.7185 12.2738 11.6382 12.6657 11.6153 13.071C9.89388 12.1619 8.66686 10.2276 8.66686 7.98702ZM18.1745 20.4C18.1745 17.6229 15.7502 15.3676 12.7186 15.3676C9.68699 15.3676 7.26264 17.6229 7.26264 20.4H5.96411C5.96411 17.2929 8.43309 14.518 11.6154 14.0919C11.6154 14.0919 11.8482 14.0638 12.0962 14.0581C12.1122 14.0574 12.1287 14.057 12.1449 14.0567H12.7186H13.2922C13.3085 14.057 13.3249 14.0574 13.3409 14.0581C13.589 14.0638 13.8217 14.0919 13.8217 14.0919C17.004 14.518 19.473 17.2929 19.473 20.4H18.1745ZM12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 21.8182C6.57666 21.8182 2.18182 17.4234 2.18182 12C2.18182 6.57666 6.57666 2.18182 12 2.18182C17.4234 2.18182 21.8182 6.57666 21.8182 12C21.8182 17.4234 17.4234 21.8182 12 21.8182Z"/>
            </svg>
            <span>Apple Podcast</span>
          </a>
          <a href="https://youtube.com/channel" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </a>
          <a href="https://xiaohongshu.com/user" target="_blank" rel="noopener noreferrer" aria-label="小红书 (Xiaohongshu)">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.256 7.913c.355.138.64.398.804.737.165.339.21.724.128 1.093-.232 1.239-1.539 2.205-3.249 2.416 1.502.763 2.566 2.021 2.931 3.467.1.397.083.813-.048 1.2a2.108 2.108 0 01-.673.963 2.272 2.272 0 01-1.078.484 2.292 2.292 0 01-1.172-.135c-.985-.405-1.756-1.396-2.074-2.639l-.327-1.27h-1.13l-.333 1.266c-.336 1.262-1.146 2.268-2.154 2.673-1.113.446-2.367-.03-2.787-1.054-.232-.57-.284-1.2-.146-1.8.367-1.59 1.566-2.969 3.193-3.707-1.68-.211-2.962-1.166-3.178-2.38-.108-.607.054-1.226.444-1.692a2.093 2.093 0 011.617-.741c1.245 0 2.358.85 2.805 2.068l.321 1.668h1.043l.302-1.563c.422-1.28 1.516-2.174 2.804-2.174.434 0 .844.122 1.213.317z"/>
            </svg>
            <span>小红书</span>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Zeprium. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.site-footer {
  background-color: #f9f9f9;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 2rem;
}

.footer-logo {
  flex: 0 0 25%;
  padding-right: 2rem;
}

.footer-logo-img {
  max-width: 120px;
}

.footer-links {
  flex: 0 0 25%;
}

.footer-links h3,
.footer-social h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  text-decoration: none;
  color: #666;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #000;
}

.footer-social {
  flex: 0 0 25%;
}

.social-icons {
  display: flex;
  flex-wrap: wrap;
}

.social-icons a {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  text-decoration: none;
  color: #666;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #000;
}

.social-icons svg {
  width: 24px;
  height: 24px;
  margin-bottom: 0.5rem;
  fill: currentColor;
}

.social-icons span {
  font-size: 0.8rem;
}

.footer-bottom {
  margin-top: 3rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.footer-bottom p {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

/* 响应式样式 */
@media (max-width: 992px) {
  .footer-logo,
  .footer-links,
  .footer-social {
    flex: 0 0 33.33%;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-logo,
  .footer-links,
  .footer-social {
    flex: 0 0 100%;
    margin-bottom: 2rem;
    padding-right: 0;
  }
  
  .social-icons {
    justify-content: center;
  }
}
</style> 