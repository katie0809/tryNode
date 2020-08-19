<template>
    <div>
        <div class="card my-3">
            <!-- 타이틀 클릭 시 각 뉴스의 페이지로 동적 라우팅 시킨다 
            특정 뉴스의 고유한 url은 article/{해당기사-제목} 이 된다.
            라우팅 넘길때 params로 article 데이터도 같이 넘긴다. -->
            <div class="card-header">
                {{ article.title.split(' - ')[0] }}
                <!-- router에 article이라는 라우터는 article/:id 경로로 이동한다고 선언함. 해당 라우터의 이름은 article임
                params에 해당 라우터 경로에서 사용할 id 변수와 articlePage에 넘겨줄 article 값을 넣어준다. -->
                <router-link :to="{name: 'article', params:{id: article.title.split(' - ')[0].replace(' ', '-'), article: article}}" class="router-btn btn btn-outline-info btn-sm">Go</router-link>
            </div>
            <div class="card-body">
                <!-- 초반 100글자만 보여준다. 사용자 설정에 따라 버튼을 바꾼다 -->
                <p class="my-3" v-if="!showFullText">
                    {{  isContentNull ? 'No Content' : article.content.split('…')[0].substring(0,100)}}...
                </p>
                <p class="my-3" v-else>
                    {{ isContentNull ? 'No Content' : article.content.split('…')[0] }}...
                    <a :href="article.url"> [link] </a>
                </p>
            </div>
            <button class="btn btn-success" v-if="!showFullText" @click="showFullText = !showFullText">Read more ↓</button>
            <button class="btn btn-danger" v-else @click="showFullText = !showFullText">Close ↑</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'news',
        props: ['article'],
        data() {
            return {
                showFullText: false
            }
        },
        computed: {
            isContentNull() {
                if(this.article.content == null || typeof(this.article.content) == 'undefined') return true;
                else return false;
            }
        }
    }
</script>

<style scoped>
    a.router-btn {
        float: right;
    }
</style>