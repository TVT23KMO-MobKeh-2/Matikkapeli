import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const TopBarComponent = ({ profileImage, username, levelAndPoints, customStyle }) => {
  return (
    <View style={[styles.container, customStyle]}>
      {/* Profile Image */}
      <Image
        source={profileImage}
        style={styles.profileImage}
        resizeMode="cover"
      />

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.levelAndPoints}>{levelAndPoints}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 10,
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  levelAndPoints: {
    fontSize: 14,
    color: "#666",
  },
});

export default TopBarComponent;
