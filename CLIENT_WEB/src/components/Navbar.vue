<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to='/'>
        <img src="../assets/logo.png" style="width:30px; height:30px" alt="">
      </router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <!-- Navbar component가 렌더링될때 현재 유저의 로그인 상태를 확인해서 적절한 Navigation bar를 보여준다. -->
          <li class="nav-item dropdown">
            <a v-if="isAuth" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Hello {{ $root.auth.user.name }}
            </a>
            <a v-else class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Register
            </a>
            <div v-if="isAuth" class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" @click="userLogout">Logout</a>
            </div>
            <div v-else class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link to="/login" class="dropdown-item">Login</router-link>
              <div class="dropdown-divider"></div>
              <router-link to="/signup" class="dropdown-item">Sign up</router-link>
            </div>
          </li>
          
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
    export default {
        name: 'Navbar',
        methods: {
          userLogout() {
            localStorage.removeItem('auth');
            this.$root.auth = {};
          }
        },
        computed: {
          isAuth() {
            // 유저가 로그인 되어있는지 여부를 반환한다
            return this.$root.auth.user ? true : false;
          }
        },
        mounted() {
          
        }
    }
</script>

<style lang="scss" scoped>

</style>