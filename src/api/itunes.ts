import axios from 'axios';

export type MovieResults = {
  resultCount: number;
  results: Movie[];
};

export type Movie = {
  wrapperType: string;
  kind: string;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  collectionArtistId: number;
  collectionArtistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  trackRentalPrice: number;
  collectionHdPrice: number;
  trackHdPrice: number;
  trackHdRentalPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  discCount: number;
  discNumber: number;
  trackCount: number;
  trackNumber: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating: string;
  shortDescription: string;
  longDescription: string;
  hasITunesExtras: boolean;
};

export const getItunesMovies = async (
  movieName?: string,
  releaseYear?: string,
): Promise<Movie | null> => {
  const response = await axios.get<MovieResults>(
    `https://itunes.apple.com/search?term=${movieName}&type=movie&media=movie`,
  );
  return (
    response.data.results.find(
      x => x.releaseDate.substring(0, 4) === releaseYear,
    ) ?? null
  );
};
