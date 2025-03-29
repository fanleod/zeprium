<template>
  <div class="login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Zeprium</h1>
          <h2>Admin Login</h2>
        </div>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group" :class="{ 'has-error': errors.email }">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              placeholder="your.email@example.com"
              required
              @focus="clearError('email')"
            >
            <small v-if="errors.email" class="error-message">{{ errors.email }}</small>
          </div>
          
          <div class="form-group" :class="{ 'has-error': errors.password }">
            <label for="password">Password</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="form.password" 
                placeholder="Your password"
                required
                @focus="clearError('password')"
              >
              <button 
                type="button" 
                class="toggle-password" 
                @click="togglePasswordVisibility"
                tabindex="-1"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 12c1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 15 12 15s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/>
                </svg>
              </button>
            </div>
            <small v-if="errors.password" class="error-message">{{ errors.password }}</small>
          </div>
          
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="form.remember">
              <label for="remember">Remember me</label>
            </div>
            
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="login-button" 
              :class="{ 'is-loading': isLoading }"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
          
          <div v-if="errorMessage" class="login-error">
            <p>{{ errorMessage }}</p>
          </div>
        </form>
        
        <div class="login-footer">
          <p>
            <router-link to="/" class="back-link">Back to Website</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      errors: {
        email: '',
        password: ''
      },
      errorMessage: '',
      showPassword: false
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading
    })
  },
  methods: {
    async login() {
      // 重置错误信息
      this.resetErrors();
      
      // 表单验证
      let isValid = this.validateForm();
      
      if (!isValid) return;
      
      try {
        // 尝试登录
        await this.$store.dispatch('auth/login', {
          email: this.form.email,
          password: this.form.password
        });
        
        // 登录成功，重定向到管理员仪表板
        this.$router.push('/admin');
      } catch (error) {
        // 处理登录错误
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Login failed. Please check your credentials.';
        } else {
          this.errorMessage = 'Unable to connect to the server. Please try again later.';
        }
      }
    },
    validateForm() {
      let isValid = true;
      
      // 验证电子邮件
      if (!this.form.email) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      // 验证密码
      if (!this.form.password) {
        this.errors.password = 'Password is required';
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      return isValid;
    },
    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    clearError(field) {
      this.errors[field] = '';
      this.errorMessage = '';
    },
    resetErrors() {
      this.errors = {
        email: '',
        password: ''
      };
      this.errorMessage = '';
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
}

.login-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 0.5rem;
}

.login-header h2 {
  font-size: 1.25rem;
  font-weight: 400;
  color: #666;
  margin: 0;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group.has-error input {
  border-color: #f44336;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  transition: border-color 0.3s ease;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #333;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 0.5rem;
}

.forgot-password {
  color: #333;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background-color: #000;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-button.is-loading {
  position: relative;
}

.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
}

.login-error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1.5rem;
}

.login-error p {
  margin: 0;
}

.login-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.back-link {
  color: #333;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style> 