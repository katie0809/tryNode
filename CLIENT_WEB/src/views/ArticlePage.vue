<template>
    <div class="container my-5">
        <div class="d-flex justify-content-between mt-4">
            <button class="btn btn-outline-info btn-sm">Prev Page</button>
            <button class="btn btn-outline-info btn-sm">Next Page</button>
        </div>  
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card">
                    <img :src="article.urlToImage" alt="" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title text-center my-3">{{ article.title }}</h5>
                        <div class="article-content">
                            {{ article.content }}
                        </div>
                        
                        <!--  -->
                        <vue-disqus shortname="vue-community-blog-2" :identifier="article.title" :url="url"></vue-disqus>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'article-page',
        data() {
            return {
                article: {},
                
                // 현재 창 window 변수를 활용하여 url을 넘겨준다. 근데 html 템플릿내에서 기본적으로 window가 뭔지 알지 못하뮤
                // 따라서 스크립트 내에서 window 변수를 사용하여 url을 저장해둔다.
                url: window.location.href,
                prevPageUrl: "",
                nextPageUrl: ""
            }
        },
        methods: {
        },
        mounted() {
            // 라우터의 param변수를 활용해서 라우팅되는 페이지에 특정 값을 실어 보낼 수 있다.
            this.article = this.$route.params.article;
            this.pageId = this.$route.params.fullPath;

        }
    }
</script>

<style lang="scss" scoped>

</style>