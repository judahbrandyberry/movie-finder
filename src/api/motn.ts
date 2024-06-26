import axios from 'axios';

type MOTNResponse = {
  streamingOptions: {
    [key: string]: Array<{
      service: {
        id: string;
        name: string;
        homePage: string;
        themeColorCode: string;
        imageSet: {
          lightThemeImage: string;
          darkThemeImage: string;
          whiteImage: string;
        };
      };
      type: 'rent' | 'buy' | 'subscription';
      link: string;
      videoLink?: string;
      quality?: string;
      audios: Array<{
        language: string;
      }>;
      subtitles: Array<{
        closedCaptions: boolean;
        locale: {
          language: string;
        };
      }>;
      price?: {
        amount: string;
        currency: string;
        formatted: string;
      };
      expiresSoon: boolean;
      availableSince: number;
    }>;
  };
};

export const getStreamingOptions = async (
  movieId?: string,
): Promise<MOTNResponse['streamingOptions'][string] | null> => {
  if (!movieId) {
    return null;
  }
  const response = await axios.get<MOTNResponse>(
    `https://streaming-availability.p.rapidapi.com/shows/${movieId}`,
    {
      headers: {
        'X-RapidAPI-Key': '713c5f9b55msh9edf5f20d70887fp119ec7jsn769caa0355ad',
      },
    },
  );

  return (
    response.data.streamingOptions['us'].filter(
      x => x.quality === 'uhd' || !x.quality,
    ) || null
  );
};
