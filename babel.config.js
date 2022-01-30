module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: [
          "react-native-paper/babel",
          "expo-image-picker",
          {
            photosPermission: "The app accesses your photos to let you pick and choose images for a Card.",
            cameraPermission: "The app accesses your camera to let you take pictures of a Card."
          }
        ]
      }
    }
  };
};
