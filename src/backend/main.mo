import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

actor {
  type Mode = {
    #learn;
    #exam;
    #build;
    #fast;
  };

  type Topic = {
    text : Text;
    description : Text;
    mode : Mode;
    response : Text;
  };

  module Topic {
    public func compare(topic1 : Topic, topic2 : Topic) : Order.Order {
      Text.compare(topic1.text, topic2.text);
    };
  };

  type UserProgress = {
    topicsExplored : Nat;
    topicHistory : List.List<Topic>;
    favorites : [Topic];
  };

  let users = Map.empty<Principal, UserProgress>();

  func getUserProgress(user : Principal) : UserProgress {
    switch (users.get(user)) {
      case (?progress) { progress };
      case (null) {
        let progress : UserProgress = {
          topicsExplored = 0;
          topicHistory = List.empty<Topic>();
          favorites = [];
        };
        users.add(user, progress);
        progress;
      };
    };
  };

  public shared ({ caller }) func addTopic(topicText : Text, description : Text, mode : Mode, response : Text) : async () {
    let userProgress = getUserProgress(caller);
    let topic : Topic = {
      text = topicText;
      description;
      mode;
      response;
    };
    userProgress.topicHistory.add(topic);
    let updatedProgress : UserProgress = {
      topicsExplored = userProgress.topicsExplored + 1;
      topicHistory = userProgress.topicHistory;
      favorites = userProgress.favorites;
    };
    users.add(caller, updatedProgress);
  };

  public shared ({ caller }) func addFavorite(topicText : Text) : async () {
    let userProgress = getUserProgress(caller);
    let topicsArray = userProgress.topicHistory.toArray();
    switch (topicsArray.find(func(t) { t.text == topicText })) {
      case (null) { Runtime.trap("Topic not found in history for user " # debug_show (caller)) };
      case (?topic) {
        let newFavorites = userProgress.favorites.concat([topic]);
        let updatedProgress : UserProgress = {
          topicsExplored = userProgress.topicsExplored;
          topicHistory = userProgress.topicHistory;
          favorites = newFavorites;
        };
        users.add(caller, updatedProgress);
      };
    };
  };

  public query ({ caller }) func getTopicHistory() : async [Topic] {
    let userProgress = getUserProgress(caller);
    userProgress.topicHistory.toArray().sort();
  };

  public query ({ caller }) func getFavorites() : async [Topic] {
    let userProgress = getUserProgress(caller);
    userProgress.favorites;
  };

  public query ({ caller }) func getProgress() : async Nat {
    let userProgress = getUserProgress(caller);
    userProgress.topicsExplored;
  };
};
