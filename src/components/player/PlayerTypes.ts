export type PlayerScreenParams = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      description: string;
      duration: string;
      image: any;
      audioUrl: string;
    };
  };
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  artwork: any;
  duration: number;
  url: string;
}; 