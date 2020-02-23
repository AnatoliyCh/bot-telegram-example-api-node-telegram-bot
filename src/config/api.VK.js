module.exports = {
  basePath: "https://api.vk.com/method/",
  methods: {
    wall: {
      getById: function(
        posts,
        access_token,
        extended = 0,
        copy_history_depth = 0,
        v = 5.103
      ) {
        return [
          "wall.getById?",
          "posts=" + posts,
          "extended=" + extended,
          "copy_history_depth=" + copy_history_depth,
          "access_token=" + access_token,
          "v=" + v
        ].join("&");
      }
    }
  }
};
