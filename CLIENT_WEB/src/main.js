/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'

// 라우팅 기능 위한 모듈. vue-router 설치해야한다
import router from './router.js'

// 아이콘 사용 위한 모듈. fontawesome 관련된 아래 3개의 모듈 설치해야한다.
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 데려온 fontawesome 라이브러리에 가져온 아이콘들을 추가해준다
// 아이콘들은 prefix로 가져온다. prefix => fas인 애들을 데려온다.
library.add(fas)

Vue.component('fontawesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

const authData = localStorage.getItem("auth");

// 여기에 등록한 정보들은 기본적으로 전체 앱에 등록된다
// 이 뷰 인스턴스의 데이터는 this.$root 키워드로 접근가능하다
new Vue({
  router,
  data: {
    // localStorage에 저장된 애가 있으면 저장된 데이터를 JSON형태로 auth에 저장.
    // 없다면 빈 배열을 갖고있는다.
    auth: authData && authData !== 'undefined' ? JSON.parse(authData) : {}
  },
  render: h => h(App)
}).$mount('#app')
