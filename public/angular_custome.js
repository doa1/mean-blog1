   /* var app = angular.module("blogApp", []);    */
   (function() {
       angular
           .module("blogApp", [])
           .controller('blogCtrl', blogController);

       function blogController($scope, $http) {
           $scope.name = "Anonymous";
           $scope.postBlog = createPost;

           //$scope.posts = getAllPosts(); embed this in the init
           //embed every function we may want to load when the page loads here
           function init() {
               getAllPosts(); //since we want to see all posts when a page loads

           }
           init();

           function createPost(post) {
               var name = $scope.name;
               var message = $scope.message;
               console.log(post)
               var userPost = { title: name, message: message };
               if (post) {
                   //if a user entered something,send to the server
                   $http.post('/api/blog/create', post).then((result) => {
                       console.log("It worked")
                       console.log(result.data);
                       //clear the input fields

                       $scope.post = '';
                       //maybe we can reload the posts to see new post
                       getAllPosts();

                   }).catch((err) => {
                       console.log("ERROR: ", err)
                   });
               } else {
                   console.log("Yuo entered nothing")
               }
           }
           //retrieve posts
           function getAllPosts() {
               $http.get('/api/posts/').then(result => {
                   console.log(result);
                   $scope.posts = result.data;

               }, error => {
                   console.log("ERROR " + error);

               });

           }
           //handle the edit n dlete feature
           $scope.editPost = editPost;
           $scope.removePost = deletePost;
           $scope.updatePost = updatePost;

           function deletePost(postid) {
               var confirmation = confirm("Sure to delete this post?")
               if (confirmation) {
                   $http.delete("/api/posts/delete/" + postid).then(
                       result => {
                           //we just reload the posts if the response status is good
                           if (result.data.status === 'success') {
                               getAllPosts();
                           }
                       }, error => {
                           console.log("Error deleting data...", error)
                       }

                   )
               } else return false;
           }

           function editPost(postid) {
               $http.get('/api/post/' + postid).then(result => {
                   $scope.name = result.data.title
                   $scope.message = result.data.body
                   $scope.post = result.data;

               }, error => {
                   console.log(error)
               });
           }

           function updatePost(post) {

               $http.put('/api/posts/edit/' + post._id, post).then(result => {

                       if (result.data.status === "updated") {
                           getAllPosts();
                           //clear the inputs 
                           $scope.post = ''
                       }
                   },
                   error => { console.log(error) })

           }
       }

   })();