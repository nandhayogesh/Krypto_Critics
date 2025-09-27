import { Movie } from "@/types/movie";
import bladeRunnerPoster from "@/assets/blade-runner-2049.jpg";
import grandBudapestPoster from "@/assets/grand-budapest-hotel.jpg";
import dunePoster from "@/assets/dune.jpg";
import pulpFictionPoster from "@/assets/pulp-fiction.jpg";
import spiritedAwayPoster from "@/assets/spirited-away.jpg";
import parasitePoster from "@/assets/parasite.jpg";

export const movies: Movie[] = [
  {
    id: "1",
    title: "Blade Runner 2049",
    year: 2017,
    director: "Denis Villeneuve",
    genre: ["Sci-Fi", "Thriller", "Drama"],
    poster: bladeRunnerPoster,
    description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
    duration: 164,
    rating: 4.2,
    reviewCount: 1247
  },
  {
    id: "2",
    title: "The Grand Budapest Hotel",
    year: 2014,
    director: "Wes Anderson",
    genre: ["Comedy", "Drama", "Adventure"],
    poster: grandBudapestPoster,
    description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
    duration: 99,
    rating: 4.5,
    reviewCount: 892
  },
  {
    id: "3",
    title: "Dune",
    year: 2021,
    director: "Denis Villeneuve",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    poster: dunePoster,
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    duration: 155,
    rating: 4.1,
    reviewCount: 2156
  },
  {
    id: "4",
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    poster: pulpFictionPoster,
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    duration: 154,
    rating: 4.8,
    reviewCount: 3421
  },
  {
    id: "5",
    title: "Spirited Away",
    year: 2001,
    director: "Hayao Miyazaki",
    genre: ["Animation", "Adventure", "Family"],
    poster: spiritedAwayPoster,
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    duration: 125,
    rating: 4.7,
    reviewCount: 1876
  },
  {
    id: "6",
    title: "Parasite",
    year: 2019,
    director: "Bong Joon-ho",
    genre: ["Thriller", "Drama", "Comedy"],
    poster: parasitePoster,
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    duration: 132,
    rating: 4.6,
    reviewCount: 2341
  }
];