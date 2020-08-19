<template>
    <div class="row my-5">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-body">
                    <div class="form-group">
                        <input v-model="name" type="text" placeholder="Name" class="form-control">
                    </div>
                    <div class="form-group">
                        <input v-model="email" type="text" placeholder="Email" class="form-control">
                    </div>
                    <div class="form-group">
                        <input v-model="password" type="text" placeholder="Password" class="form-control">
                    </div>
                    <div class="form-group text-right">
                        <button @click="registerUser()" :disabled="loading" class="btn btn-success form-control">
                            <fontawesome-icon :icon="['fas', 'spinner']" v-if="loading"></fontawesome-icon>
                            {{ loading ? '' : 'Signup' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'signup',
        // 라우팅을 통해 해당 컴포넌트가 로드되기 전에 실행되는 함수
        // 즉, 이미 로그인된 유저가 /login을 웹사이트에 쳐서 접근하지 못하도록 막는 등...의 기능에 필요
        beforeRouteEnter(to, from, next) {

            // 유저가 로그인 되었다면 signup페이지 컴포넌트에 접근할 수 없다
            // "BEFORE" component loading 에 실행되기 때문에 this.$root.auth로 접근할 수 없다.
            // 해당 함수가 실행되는 시점에는 아직 this가 없기 때문;;
            if(localStorage.getItem('auth'))
            {
                // 이미 로그인된 유저라면 메인페이지로 보내버린다
                return next({ path: '/' });   
            }
            else{
                // 로그인전 유저라면 signup페이지로 보내준다
                // next() 함수가 호출되어야만 signup 컴포넌트가 로드된다
                next();
            }
        },
        data() {
            return {
                name: '',
                email: '',
                password: '',
                loading: false
            }
        },
        methods: {
            registerUser() {
                
                // spinner를 보여준다
                this.loading = true;

                Axios.post('https://react-blog-api.bahdcasts.com/api/auth/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }).then(({response}) => {
                    // response에서 데이터는 원래 response.data.data에 들어있다.
                    // {}로 감싸줌으로서 Object response를 destructuring 할 수 있다.
                    this.$root.auth = response;
                    this.loading = false;
                }).catch(() => {
                    // 해당 api는 더이상 동작하지 않는다.
                    // 강제로 값을 넣어준다.
                    let response = {
                        config: {timeout: 0, xsrfCookieName: "XSRF-TOKEN", status: 200},
                        data: {
                            data: {
                                token: "woehiafksnl329aYEOWKcdlskfa.lwihef981234LHFleirhaldfky",
                                user: {
                                    created_at: "2019-07-24 14:35:24",
                                    email: "fake@user.email",
                                    id: 256,
                                    name: "Hongildong",
                                    updated_at: "2019-07-24 15:35:24"
                                }
                            }
                        },
                        headers: {content_type: "application/json", cache_control: "private, must-revalidate"}
                    };

                    // 객체 디스트럭쳐 (Object destructuring) => ES6 문법
                    // response에서 key가 data인 애의 내용을 뽑아서 tmpData라는 객체에 저장한다
                    // tmpData에서 key가 data인 애의 내용을 뽑아서 저장한다. 이름 따로 지정 안했으므로 객체명은 그대로 data
                    const { data: tmpData } = response;
                    const { data } = tmpData;

                    // localStorage에 key 'auth'로 데이터를 저장한다.
                    localStorage.setItem('auth', JSON.stringify(data));
                    
                    // this.$root => root vue instance를 referencing한다
                    this.$root.auth = data;

                    // 로딩아이콘 비활성화
                    this.loading = false;

                    // notification을 띄운다 => 제대로 동작 안함. 모듈 문제인듯
                    // this.$noty.success("You've successfully logged in");

                    // 유저가 성공적으로 등록되었다면 promatically redirect to Home page
                    // router.js에서 Vue.use(VueRouter)를 함으로써 전역적으로 뷰 라우터를 사용할 수 있게됨.
                    // 이동을 원하는 페이지명을 넘겨주면 이동한다.
                    this.$router.push('/');
                });

                
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>