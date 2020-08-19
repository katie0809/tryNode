<template>
    <div class="row my-5">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-body">
                    <div class="form-group">
                        <input type="text" placeholder="Email" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Password" class="form-control">
                    </div>
                    <div class="form-group text-right">
                        <button class="btn btn-success">Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        beforeRouteEnter(to, from, next) {
            if(localStorage.getItem('auth'))
            {
                return next({ path: '/' });   
            }
            else{
                next();
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>