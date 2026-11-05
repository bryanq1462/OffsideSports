import { Jersey, Review, League, SportCategory } from '../types';

export const SPORTS_LIST: { id: SportCategory | 'all'; name: string; icon: string; description: string }[] = [
  { id: 'all', name: 'Todos los Deportes', icon: '🏆', description: 'Todo el catálogo de productos' },
  { id: 'Fútbol', name: 'Fútbol', icon: '⚽', description: 'Camisetas de clubes y selecciones del mundo' },
  { id: 'Basketball', name: 'Basketball', icon: '🏀', description: 'Jerseys oficiales NBA de tus estrellas favoritas' },
  { id: 'Béisbol', name: 'Béisbol', icon: '⚾', description: 'Camisolas de la MLB de Grandes Ligas' },
  { id: 'Fórmula 1', name: 'Fórmula 1', icon: '🏎️', description: 'Polos, chaquetas y gorras oficiales F1' },
  { id: 'Fútbol Americano', name: 'Fútbol Americano', icon: '🏈', description: 'Jerseys oficiales NFL de la liga' },
];

export const INITIAL_LEAGUES: League[] = [
  'Liga Promerica (CR)',
  'UEFA Champions League',
  'LaLiga',
  'Premier League',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'MLS',
  'Saudi Pro League',
  'Liga Argentina',
  'Brasileirão',
  'Liga BetPlay',
  'Selecciones',
  'Clásicos Retro',
  'NBA',
  'MLB',
  'F1',
  'NFL'
];

export const LEAGUE_FLAGS: Record<string, string> = {
  'Liga Promerica (CR)': '🇨🇷',
  'UEFA Champions League': '🇪🇺',
  'LaLiga': '🇪🇸',
  'Premier League': '🏴󠁧󠁢󠁥ⁿ󠁧󠁿',
  'Serie A': '🇮🇹',
  'Bundesliga': '🇩🇪',
  'Ligue 1': '🇫🇷',
  'MLS': '🇺🇸',
  'Saudi Pro League': '🇸🇦',
  'Liga Argentina': '🇦🇷',
  'Brasileirão': '🇧🇷',
  'Liga BetPlay': '🇨🇴',
  'Selecciones': '🌍',
  'Clásicos Retro': '🏛️',
  'NBA': '🏀',
  'MLB': '⚾',
  'F1': '🏎️',
  'NFL': '🏈'
};

export const TEAMS_BY_LEAGUE: Record<string, string[]> = {
  'Liga Promerica (CR)': ['Saprissa', 'L.D. Alajuelense', 'Herediano', 'Cartaginés', 'Puntarenas FC'],
  'UEFA Champions League': ['Real Madrid', 'Manchester City', 'Bayern Múnich', 'PSG', 'FC Barcelona', 'Inter de Milán'],
  'LaLiga': ['Real Madrid', 'FC Barcelona', 'Atlético de Madrid', 'Real Betis'],
  'Premier League': ['Manchester City', 'Arsenal', 'Liverpool', 'Manchester United', 'Chelsea'],
  'Serie A': ['Inter de Milán', 'AC Milan', 'Juventus', 'Roma'],
  'Bundesliga': ['Bayern Múnich', 'Borussia Dortmund', 'Bayer Leverkusen'],
  'Ligue 1': ['PSG', 'Olympique de Marsella', 'AS Mónaco'],
  'MLS': ['Inter Miami', 'LAFC', 'LA Galaxy', 'Columbus Crew'],
  'Saudi Pro League': ['Al Nassr', 'Al Hilal', 'Al Ittihad', 'Al Ahli'],
  'Liga Argentina': ['Boca Juniors', 'River Plate', 'Racing Club'],
  'Brasileirão': ['Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians'],
  'Liga BetPlay': ['Atlético Nacional', 'Millonarios', 'América de Cali', 'Junior'],
  'Selecciones': ['Selección Colombia', 'Selección Argentina', 'Selección Francia', 'Selección Brasil', 'Selección Japón'],
  'Clásicos Retro': ['Real Madrid 2002 (Centenario)', 'Boca Juniors 2000 (Japón)', 'Colombia 1990 (Valderrama)', 'AC Milan 2007'],
  'NBA': ['Los Angeles Lakers', 'Golden State Warriors', 'Chicago Bulls', 'Boston Celtics'],
  'MLB': ['New York Yankees', 'Los Angeles Dodgers', 'Boston Red Sox'],
  'F1': ['Red Bull Racing', 'Scuderia Ferrari', 'Mercedes-AMG F1', 'McLaren F1'],
  'NFL': ['Kansas City Chiefs', 'San Francisco 49ers', 'Dallas Cowboys']
};

export const INITIAL_JERSEYS: Jersey[] = [
  {
    "stock": 2,
    "badgeTags": [
      "MS10"
    ],
    "isNew": true,
    "yearSeason": "2026/2027",
    "price": 20000,
    "team": "Argentina",
    "image": "/images/jerseys/off-custom-1789247716654.jpg",
    "description": "La última camiseta del GOAT con su selección",
    "id": "off-custom-1789247716654",
    "backImage": "/images/jerseys/off-custom-1789247716654-back.jpg",
    "originalPrice": 25000,
    "sizesAvailable": [
      "S",
      "XL"
    ],
    "rating": 5,
    "originalPriceCRC": 25000,
    "reviewsCount": 1,
    "fabricInfo": "Tecnología CLIMACOOL+",
    "version": "Versión Jugador (Player Issue)",
    "genderCategory": "Unisex (Adulto)",
    "priceCRC": 20000,
    "league": "Selecciones",
    "type": "Local",
    "discountPercent": 20,
    "name": "Argentina Local 26/27",
    "images": []
  },
  {
    "stock": 1,
    "isNew": true,
    "yearSeason": "2026/2027",
    "discountPercent": 20,
    "rating": 5,
    "type": "Visitante",
    "reviewsCount": 1,
    "name": "Portugal Visita 26/27",
    "description": "La última camiseta del comandante con Portugal",
    "league": "Selecciones",
    "price": 20000,
    "priceCRC": 20000,
    "image": "/images/jerseys/off-custom-1789248106235.jpg",
    "images": [],
    "version": "Versión Jugador (Player Issue)",
    "team": "Portugal",
    "fabricInfo": "Tecnología ULTRAWEAVEV",
    "backImage": "/images/jerseys/off-custom-1789248106235-back.jpg",
    "originalPrice": 25000,
    "sizesAvailable": [
      "XXL"
    ],
    "badgeTags": [
      "CR7"
    ],
    "genderCategory": "Unisex (Adulto)",
    "id": "off-custom-1789248106235",
    "originalPriceCRC": 25000
  },
  {
    "rating": 5,
    "genderCategory": "Unisex (Adulto)",
    "fabricInfo": "Tecnología dryCELL ",
    "priceCRC": 23000,
    "sizesAvailable": [
      "XL"
    ],
    "reviewsCount": 1,
    "id": "off-custom-1789248294189",
    "type": "Local",
    "league": "Premier League",
    "description": "La nueva camiseta del Manchester City con el Dorsal del Noruego Haaland",
    "name": "Manchester City local 26/27",
    "version": "Versión Fan (Aficionado)",
    "images": [],
    "yearSeason": "2026/2027",
    "isNew": true,
    "stock": 1,
    "backImage": "/images/jerseys/off-custom-1789248294189-back.jpg",
    "image": "/images/jerseys/off-custom-1789248294189.jpg",
    "price": 23000,
    "team": "Manchester City",
    "badgeTags": [
      "Nueva Temporada"
    ]
  },
  {
    "stock": 1,
    "isNew": true,
    "badgeTags": [
      "Nueva Temporada"
    ],
    "yearSeason": "2026/2027",
    "price": 23000,
    "team": "Bayern Munchen",
    "id": "off-custom-1789248641499",
    "image": "/images/jerseys/off-custom-1789248641499.jpg",
    "description": "La nueva camiseta del equipo Babaro para esta nueva temporada 2026/2027",
    "backImage": "/images/jerseys/off-custom-1789248641499-back.jpg",
    "sizesAvailable": [
      "M"
    ],
    "rating": 5,
    "reviewsCount": 1,
    "genderCategory": "Unisex (Adulto)",
    "version": "Versión Fan (Aficionado)",
    "fabricInfo": "Tecnología CLIMACOOL",
    "priceCRC": 23000,
    "league": "Bundesliga",
    "type": "Local",
    "name": "Bayern Munchen Local 26/27",
    "images": []
  },
  {
    "badgeTags": [
      "Nueva Temporada"
    ],
    "description": "Camiseta del actual bocampeón de la champions",
    "team": "PSG",
    "priceCRC": 23000,
    "price": 23000,
    "image": "/images/jerseys/off-custom-1789248977635.jpg",
    "fabricInfo": "Tecnología Dri-FIT ",
    "backImage": "/images/jerseys/off-custom-1789248977635-back.jpg",
    "sizesAvailable": [
      "L"
    ],
    "stock": 1,
    "isNew": true,
    "genderCategory": "Unisex (Adulto)",
    "id": "off-custom-1789248977635",
    "name": "PSG Local 26/27",
    "rating": 5,
    "type": "Local",
    "images": [],
    "yearSeason": "2026/2027",
    "reviewsCount": 1,
    "version": "Versión Fan (Aficionado)",
    "league": "Ligue 1"
  },
  {
    "price": 23000,
    "genderCategory": "Unisex (Adulto)",
    "image": "/images/jerseys/off-custom-1789249420279.jpg",
    "sizesAvailable": [
      "L"
    ],
    "name": "Real Madrid Local 26/27",
    "id": "off-custom-1789249420279",
    "reviewsCount": 1,
    "priceCRC": 23000,
    "fabricInfo": "Tecnología CLIMACOOL",
    "type": "Local",
    "description": "Nueva camiseta del Club Español para esta nueva temporada",
    "stock": 1,
    "isNew": true,
    "rating": 5,
    "badgeTags": [
      "Nueva Temporada"
    ],
    "images": [],
    "version": "Versión Fan (Aficionado)",
    "team": "Real Madrid",
    "backImage": "/images/jerseys/off-custom-1789249420279-back.jpg",
    "league": "LaLiga",
    "yearSeason": "2026/2027"
  },
  {
    "name": "Brasil Local 24/25",
    "type": "Local",
    "fabricInfo": "Dri-FIT ADV",
    "originalPrice": 25000,
    "discountPercent": 30,
    "genderCategory": "Unisex (Adulto)",
    "version": "Versión Jugador (Player Issue)",
    "id": "off-custom-1789249640007",
    "originalPriceCRC": 25000,
    "reviewsCount": 1,
    "description": "Nike volvió a colocar el escudo de la CBF en el centro del pecho después de 20 años",
    "priceCRC": 17000,
    "sizesAvailable": [
      "XL"
    ],
    "images": [],
    "badgeTags": [
      "Selecciones"
    ],
    "league": "Selecciones",
    "team": "Brasil",
    "price": 17000,
    "yearSeason": "2024/2025",
    "image": "/images/jerseys/off-custom-1789249640007.jpg",
    "stock": 1,
    "isNew": true,
    "backImage": "/images/jerseys/off-custom-1789249640007-back.jpg",
    "rating": 5
  },
  {
    "stock": 1,
    "isNew": true,
    "description": "Esta camiseta es un guño a la mítica camiseta de 2014 qué fue la última vez que Alemania salió campeona del mundo ",
    "name": "Alemania Local 26/27",
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789250406522.jpg",
    "yearSeason": "2026/2027",
    "id": "off-custom-1789250406522",
    "priceCRC": 17000,
    "type": "Local",
    "discountPercent": 25,
    "originalPrice": 23000,
    "rating": 5,
    "badgeTags": [
      "Selecciones"
    ],
    "backImage": "/images/jerseys/off-custom-1789250406522-back.jpg",
    "sizesAvailable": [
      "M"
    ],
    "fabricInfo": "Tecnología CLIMACOOL ",
    "reviewsCount": 1,
    "originalPriceCRC": 23000,
    "league": "Selecciones",
    "team": "Alemania",
    "images": [],
    "version": "Versión Fan (Aficionado)",
    "genderCategory": "Unisex (Adulto)"
  },
  {
    "image": "/images/jerseys/off-custom-1789250609228.jpg",
    "price": 17000,
    "type": "Retro",
    "fabricInfo": "Tecnología Nike Fit",
    "discountPercent": 30,
    "isNew": true,
    "originalPrice": 25000,
    "stock": 1,
    "reviewsCount": 1,
    "name": "Manchester United Local 2008",
    "version": "Versión Fan (Aficionado)",
    "backImage": "/images/jerseys/off-custom-1789250609228-back.jpg",
    "originalPriceCRC": 25000,
    "id": "off-custom-1789250609228",
    "images": [],
    "league": "Clásicos Retro",
    "yearSeason": "2008",
    "description": "Mítica camiseta del CR7 del 2008 con la que gano su primer Champions League. ",
    "badgeTags": [
      "Retro"
    ],
    "genderCategory": "Unisex (Adulto)",
    "priceCRC": 17000,
    "team": "Manchester United",
    "rating": 5,
    "sizesAvailable": [
      "L"
    ]
  },
  {
    "version": "Versión Fan (Aficionado)",
    "type": "Local",
    "name": "Francia Local 26/27",
    "discountPercent": 15,
    "yearSeason": "2026/2027",
    "priceCRC": 20000,
    "originalPrice": 23000,
    "league": "Selecciones",
    "team": "Francia",
    "stock": 1,
    "backImage": "/images/jerseys/off-custom-1789250796615-back.png",
    "isNew": true,
    "genderCategory": "Unisex (Adulto)",
    "description": "La camiseta del nuevo Máximo golpeador de los mundiales",
    "images": [],
    "sizesAvailable": [
      "M"
    ],
    "badgeTags": [
      "Selecciones"
    ],
    "fabricInfo": "Tecnología Dri-FIT",
    "rating": 5,
    "originalPriceCRC": 23000,
    "price": 20000,
    "reviewsCount": 1,
    "image": "/images/jerseys/off-custom-1789250796615.jpg",
    "id": "off-custom-1789250796615"
  },
  {
    "version": "Versión Fan (Aficionado)",
    "yearSeason": "2024/2025",
    "reviewsCount": 1,
    "badgeTags": [
      "Histórica"
    ],
    "priceCRC": 17000,
    "type": "Retro",
    "backImage": "/images/jerseys/off-custom-1789251115869-back.jpg",
    "originalPriceCRC": 25000,
    "discountPercent": 30,
    "name": "Borussia Dortmund Local 24/25",
    "fabricInfo": "Tecnología DRYCELL",
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789251115869.png",
    "images": [],
    "genderCategory": "Unisex (Adulto)",
    "originalPrice": 25000,
    "sizesAvailable": [
      "XL"
    ],
    "league": "Bundesliga",
    "description": "​Homenaje a la Champions de 1997 ",
    "id": "off-custom-1789251115869",
    "team": "Borussia Dortmund",
    "stock": 1,
    "rating": 5,
    "isNew": true
  },
  {
    "league": "LaLiga",
    "type": "Edición Especial",
    "name": "Atlético de Madrid TOTAL 90 25/26",
    "images": [],
    "fabricInfo": "Tecnología DRI-FIT ADV",
    "originalPrice": 25000,
    "description": "Un giño a las míticas camisetas de TOTAL 90 de hace unos años",
    "version": "Versión Jugador (Player Issue)",
    "rating": 5,
    "sizesAvailable": [
      "XL"
    ],
    "genderCategory": "Unisex (Adulto)",
    "team": "Atlético de Madrid",
    "stock": 1,
    "discountPercent": 30,
    "isNew": true,
    "reviewsCount": 1,
    "badgeTags": [
      "TOTAL 90"
    ],
    "yearSeason": "2025/2026",
    "originalPriceCRC": 25000,
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789251479378.jpg",
    "priceCRC": 17000,
    "id": "off-custom-1789251479378",
    "backImage": "/images/jerseys/off-custom-1789251479378-back.jpg"
  },
  {
    "description": "Un giño a las míticas camisetas de TOTAL 90 de hace unos años",
    "priceCRC": 17000,
    "badgeTags": [
      "TOTAL 90"
    ],
    "id": "off-custom-1789251565057",
    "version": "Versión Jugador (Player Issue)",
    "fabricInfo": "Tecnología DRI-FIT ADV",
    "type": "Edición Especial",
    "backImage": "/images/jerseys/off-custom-1789251565057-back.png",
    "name": "PSG TOTAL 90 24/25",
    "discountPercent": 30,
    "image": "/images/jerseys/off-custom-1789251565057.jpg",
    "price": 17000,
    "yearSeason": "2024/2025",
    "rating": 5,
    "originalPriceCRC": 25000,
    "reviewsCount": 1,
    "genderCategory": "Unisex (Adulto)",
    "images": [],
    "originalPrice": 25000,
    "team": "PSG",
    "isNew": true,
    "stock": 1,
    "league": "Ligue 1",
    "sizesAvailable": [
      "L"
    ]
  },
  {
    "league": "Selecciones",
    "isNew": true,
    "stock": 1,
    "type": "Local",
    "images": [],
    "discountPercent": 40,
    "name": "Inglaterra Local 2025",
    "backImage": "/images/jerseys/off-custom-1789252085572-back.jpg",
    "originalPrice": 23000,
    "version": "Versión Fan (Aficionado)",
    "rating": 5,
    "yearSeason": "2025",
    "image": "/images/jerseys/off-custom-1789252085572.jpg",
    "price": 14000,
    "badgeTags": [
      "Selecciones"
    ],
    "priceCRC": 14000,
    "sizesAvailable": [
      "M"
    ],
    "team": "Inglaterra",
    "id": "off-custom-1789252085572",
    "description": "Camiseta oficial versión jugador con tela de alta definición.",
    "genderCategory": "Unisex (Adulto)",
    "fabricInfo": "Tecnología DRI-FIT ADV",
    "reviewsCount": 1,
    "originalPriceCRC": 23000
  },
  {
    "sizesAvailable": [
      "XL"
    ],
    "genderCategory": "Unisex (Adulto)",
    "priceCRC": 17000,
    "discountPercent": 25,
    "sportCategory": "Fórmula 1",
    "originalPriceCRC": 23000,
    "name": "Mclaren 2023",
    "league": "F1",
    "description": "Elegante camiseta del equipo de fórmula 1 de Mclaren",
    "isNew": true,
    "images": [],
    "version": "Versión Fan (Aficionado)",
    "originalPrice": 23000,
    "badgeTags": [
      "Fórmula 1"
    ],
    "team": "Mclaren",
    "yearSeason": "2023",
    "reviewsCount": 1,
    "stock": 1,
    "type": "Local",
    "backImage": "/images/jerseys/off-custom-1789252281139-back.jpg",
    "id": "off-custom-1789252281139",
    "fabricInfo": "Tecnología Teamwear",
    "rating": 5,
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789252281139.jpg"
  },
  {
    "reviewsCount": 1,
    "name": "Ferrari 2025",
    "backImage": "/images/jerseys/off-custom-1789252532883-back.jpg",
    "images": [],
    "league": "F1",
    "description": "Camiseta increíble por parte del equipo de Ferrari",
    "id": "off-custom-1789252532883",
    "isNew": true,
    "discountPercent": 25,
    "originalPriceCRC": 23000,
    "version": "Versión Fan (Aficionado)",
    "sportCategory": "Fórmula 1",
    "type": "Local",
    "fabricInfo": "Tecnología DryCELL ",
    "genderCategory": "Unisex (Adulto)",
    "sizesAvailable": [
      "XL"
    ],
    "originalPrice": 23000,
    "team": "Ferrari",
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789252532883.jpg",
    "stock": 1,
    "badgeTags": [
      "Fórmula 1"
    ],
    "yearSeason": "2025",
    "priceCRC": 17000,
    "rating": 5
  },
  {
    "priceCRC": 17000,
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789252838984.jpg",
    "originalPrice": 25000,
    "rating": 5,
    "description": "Lema oficial del equipo \"Keep Pounding\" estampado en el interior de la línea del cuello",
    "discountPercent": 30,
    "backImage": "/images/jerseys/off-custom-1789252838984-back.jpg",
    "stock": 1,
    "sportCategory": "Fútbol Americano",
    "name": "Carolina Panthers Local 17/22",
    "reviewsCount": 1,
    "originalPriceCRC": 25000,
    "version": "Versión Fan (Aficionado)",
    "badgeTags": [
      "NFL"
    ],
    "images": [],
    "team": "Carolina Panthers",
    "yearSeason": "2017/2022",
    "isNew": true,
    "league": "NFL",
    "sizesAvailable": [
      "XL"
    ],
    "genderCategory": "Unisex (Adulto)",
    "id": "off-custom-1789252838984",
    "type": "Local",
    "fabricInfo": "Nike Game"
  },
  {
    "name": "Golden State Warriors Local 22/23",
    "version": "Versión Fan (Aficionado)",
    "isNew": true,
    "originalPrice": 23000,
    "rating": 5,
    "priceCRC": 17000,
    "id": "off-custom-1789253061366",
    "description": "diseño limpio y atemporal sin modificaciones visuales mayores durante las temporadas posteriores",
    "sportCategory": "Basketball",
    "genderCategory": "Unisex (Adulto)",
    "badgeTags": [
      "NBA"
    ],
    "sizesAvailable": [
      "L"
    ],
    "league": "NBA",
    "stock": 1,
    "originalPriceCRC": 23000,
    "images": [],
    "yearSeason": "2022/2023",
    "type": "Local",
    "reviewsCount": 1,
    "image": "/images/jerseys/off-custom-1789253061366.jpg",
    "price": 17000,
    "backImage": "/images/jerseys/off-custom-1789253061366-back.jpg",
    "fabricInfo": "Tecnología DRI-FIT ",
    "team": "Warriors",
    "discountPercent": 25
  },
  {
    "name": "Angeles Lakers 25/26",
    "yearSeason": "2025/2026",
    "rating": 5,
    "originalPriceCRC": 23000,
    "price": 17000,
    "image": "/images/jerseys/off-custom-1789253234587.jpg",
    "id": "off-custom-1789253234587",
    "stock": 1,
    "version": "Versión Fan (Aficionado)",
    "fabricInfo": "Dri-FIT",
    "description": "Icónico logotipo Jumpman de Jordan, dándole un estatus estético superior y más urbano.",
    "backImage": "/images/jerseys/off-custom-1789253234587-back.jpg",
    "images": [],
    "type": "Visitante",
    "league": "NBA",
    "priceCRC": 17000,
    "sportCategory": "Basketball",
    "team": "Lakers",
    "sizesAvailable": [
      "XL"
    ],
    "genderCategory": "Unisex (Adulto)",
    "reviewsCount": 1,
    "discountPercent": 25,
    "badgeTags": [
      "NBA"
    ],
    "isNew": true,
    "originalPrice": 23000
  },
  {
    "badgeTags": [
      "Selecciones"
    ],
    "reviewsCount": 1,
    "id": "off-custom-1789253931343",
    "league": "Selecciones",
    "version": "Versión Fan (Aficionado)",
    "isNew": true,
    "images": [],
    "stock": 1,
    "rating": 5,
    "backImage": "/images/jerseys/off-custom-1789253931343-back.jpg",
    "originalPrice": 23000,
    "description": "Camiseta Local de la sele con un diseño extravagante",
    "image": "/images/jerseys/off-custom-1789253931343.jpg",
    "price": 14000,
    "fabricInfo": "Tecnología Aeroready",
    "team": "Costa Rica",
    "priceCRC": 14000,
    "originalPriceCRC": 23000,
    "sizesAvailable": [
      "XXL"
    ],
    "discountPercent": 40,
    "name": "Costa Rica Local 24/25",
    "yearSeason": "2024/2025",
    "type": "Local",
    "genderCategory": "Unisex (Adulto)"
  },
  {
    "backImage": "/images/jerseys/off-custom-1789254181770-back.jpg",
    "description": "Iconicas camiseta de Brasil con sus modernos TOTAL 90 de la época, muy recordada por el dorsal del Ronaldinho",
    "stock": 1,
    "isNew": true,
    "badgeTags": [
      "Retro"
    ],
    "price": 25000,
    "fabricInfo": "Nike TOTAL 90",
    "image": "/images/jerseys/off-custom-1789254181770.jpg",
    "team": "Brasil",
    "rating": 5,
    "reviewsCount": 1,
    "genderCategory": "Unisex (Adulto)",
    "name": "Brasil Local 2004/2005 TOTAL 90",
    "id": "off-custom-1789254181770",
    "yearSeason": "2004/2005",
    "league": "Clásicos Retro",
    "priceCRC": 25000,
    "images": [],
    "type": "Retro",
    "sizesAvailable": [
      "XL"
    ],
    "version": "Versión Fan (Aficionado)"
  },
  {
    "backImage": "/images/jerseys/off-custom-1789254494964-back.jpg",
    "description": "El llamativo color naranja rinde un tributo directo a la icónica tercera equipación de la temporada 2013/14, recordada con nostalgia por los madridistas al ser la indumentaria utilizada en el camino hacia la conquista de \"La Décima\" Champions League.",
    "stock": 1,
    "originalPrice": 23000,
    "isNew": true,
    "badgeTags": [
      "Nostálgica"
    ],
    "price": 17000,
    "fabricInfo": "Tecnología Aeroready",
    "image": "/images/jerseys/off-custom-1789254494964.jpg",
    "team": "Real Madrid",
    "rating": 5,
    "reviewsCount": 1,
    "discountPercent": 25,
    "genderCategory": "Unisex (Adulto)",
    "name": "Real Madrid visita 24/25",
    "id": "off-custom-1789254494964",
    "yearSeason": "2024/2025",
    "league": "LaLiga",
    "originalPriceCRC": 23000,
    "priceCRC": 17000,
    "type": "Visitante",
    "images": [],
    "version": "Versión Fan (Aficionado)",
    "sizesAvailable": [
      "L"
    ]
  },
  {
    "reviewsCount": 1,
    "isNew": true,
    "priceCRC": 25000,
    "stock": 1,
    "fabricInfo": "Tecnología CLIMACOOL+",
    "image": "/images/jerseys/off-custom-1789254593214.jpg",
    "name": "Real Madrid Local 26/27",
    "version": "Versión Jugador (Player Issue)",
    "price": 25000,
    "type": "Local",
    "league": "LaLiga",
    "images": [],
    "id": "off-custom-1789254593214",
    "backImage": "/images/jerseys/off-custom-1789254593214-back.jpg",
    "rating": 5,
    "description": "Nueva camiseta del Club Español para esta nueva temporada. \n",
    "yearSeason": "2026/2027",
    "genderCategory": "Unisex (Adulto)",
    "sizesAvailable": [
      "XL"
    ],
    "team": "Real Madrid",
    "badgeTags": [
      "Nueva Temporada"
    ]
  },
  {
    "description": "La camiseta visitante de la selección de España ya con sus 2 estrella y parches de campeón. ",
    "team": "España",
    "version": "Versión Fan (Aficionado)",
    "fabricInfo": "Tecnología CLIMACOOL ",
    "price": 23000,
    "rating": 5,
    "image": "/images/jerseys/off-custom-1789330231708.png",
    "images": [
      "/images/jerseys/off-custom-1789330231708.png"
    ],
    "stock": 1,
    "isNew": true,
    "league": "Selecciones",
    "id": "off-custom-1789330231708",
    "backImage": "/images/jerseys/off-custom-1789330231708-back.jpg",
    "name": "España Visita 26/27",
    "yearSeason": "2026/2027",
    "type": "Visitante",
    "reviewsCount": 1,
    "sizesAvailable": [
      "M"
    ],
    "badgeTags": [
      "Campeón del mundo"
    ],
    "priceCRC": 23000,
    "genderCategory": "Unisex (Adulto)"
  },
  {
    "fabricInfo": "Tecnología CLIMACOOL ",
    "team": "España",
    "price": 25000,
    "image": "/images/jerseys/off-custom-1789330364878.png",
    "rating": 5,
    "reviewsCount": 1,
    "stock": 1,
    "images": [],
    "isNew": true,
    "league": "Selecciones",
    "version": "Versión Jugador (Player Issue)",
    "description": "La camiseta visitante de la selección de España ya con sus 2 estrella y parches de campeón.",
    "sizesAvailable": [
      "XL"
    ],
    "yearSeason": "2026/2027",
    "backImage": "/images/jerseys/off-custom-1789330364878-back.png",
    "type": "Visitante",
    "name": "España Visita 26 /27",
    "genderCategory": "Unisex (Adulto)",
    "badgeTags": [
      "Campeona del mundo"
    ],
    "priceCRC": 25000,
    "id": "off-custom-1789330364878"
  },
  {
    "type": "Local",
    "id": "off-custom-1789330664486",
    "images": [
      "/images/jerseys/off-custom-1789330664486.jpg"
    ],
    "image": "/images/jerseys/off-custom-1789330664486.jpg",
    "league": "Selecciones",
    "description": "La camiseta local de la selección de España ya con sus 2 estrella y parches de campeón ",
    "price": 25000,
    "fabricInfo": "Tecnología CLIMACOOL ",
    "name": "España Local 26/27",
    "isNew": true,
    "version": "Versión Jugador (Player Issue)",
    "stock": 1,
    "sizesAvailable": [
      "M"
    ],
    "genderCategory": "Unisex (Adulto)",
    "rating": 5,
    "backImage": "/images/jerseys/off-custom-1789330664486-back.png",
    "team": "España",
    "yearSeason": "2026/2027",
    "badgeTags": [
      "Campeona del mundo"
    ],
    "reviewsCount": 1,
    "priceCRC": 25000
  },
  {
    "image": "/images/jerseys/off-custom-1789330759761.jpg",
    "reviewsCount": 1,
    "price": 23000,
    "badgeTags": [
      "Cempeona del mundo"
    ],
    "type": "Local",
    "priceCRC": 23000,
    "isNew": true,
    "stock": 1,
    "backImage": "/images/jerseys/off-custom-1789330759761-back.jpg",
    "yearSeason": "2026/2027",
    "name": "España Local 26/27",
    "version": "Versión Fan (Aficionado)",
    "genderCategory": "Unisex (Adulto)",
    "id": "off-custom-1789330759761",
    "images": [
      "/images/jerseys/off-custom-1789330759761.jpg"
    ],
    "sizesAvailable": [
      "L"
    ],
    "league": "Selecciones",
    "description": "La camiseta local de la selección de España ya con sus 2 estrella y parches de campeón ",
    "team": "España",
    "rating": 5,
    "fabricInfo": "Tecnología CLIMACOOL "
  },
  {
    "name": "Real Madrid Visita 26/27",
    "fabricInfo": "Tecnología CLIMACOOL ",
    "priceCRC": 23000,
    "type": "Visitante",
    "price": 23000,
    "image": "/images/jerseys/off-custom-1789331153601.jpg",
    "badgeTags": [
      "Nueva Temporada"
    ],
    "id": "off-custom-1789331153601",
    "reviewsCount": 1,
    "stock": 2,
    "genderCategory": "Unisex (Adulto)",
    "isNew": true,
    "sizesAvailable": [
      "M",
      "XXL"
    ],
    "description": "Nueva camiseta del Real Madrid con un diseño moderno ",
    "backImage": "/images/jerseys/off-custom-1789331153601-back.jpg",
    "yearSeason": "2026/2027",
    "team": "Real Madrid",
    "rating": 5,
    "images": [
      "/images/jerseys/off-custom-1789331153601.jpg",
      "/images/jerseys/off-custom-1789331153601.jpg"
    ],
    "version": "Versión Fan (Aficionado)",
    "league": "LaLiga"
  },
  {
    "images": [
      "/images/jerseys/off-custom-1789331659938.jpg",
      "/images/jerseys/off-custom-1789331659938.jpg"
    ],
    "type": "Visitante",
    "league": "LaLiga",
    "name": "Barcelona Visita 26/27",
    "version": "Versión Fan (Aficionado)",
    "yearSeason": "2026/2027",
    "id": "off-custom-1789331659938",
    "description": "Nueva camiseta del Barcelona en colaboración con Kobe Bryant",
    "rating": 5,
    "priceCRC": 23000,
    "genderCategory": "Unisex (Adulto)",
    "team": "Barcelona",
    "price": 23000,
    "badgeTags": [
      "Nueva Temporada"
    ],
    "image": "/images/jerseys/off-custom-1789331659938.jpg",
    "reviewsCount": 1,
    "sizesAvailable": [
      "XXL"
    ],
    "stock": 1,
    "isNew": true,
    "fabricInfo": "Tecnología DRI-FIT ADV",
    "backImage": "/images/jerseys/off-custom-1789331659938-back.jpg"
  },
  {
    "id": "off-custom-1789332002533",
    "badgeTags": [
      "Nueva Temporada"
    ],
    "rating": 5,
    "sizesAvailable": [
      "XL"
    ],
    "yearSeason": "2026/2027",
    "backImage": "/images/jerseys/off-custom-1789332002533-back.jpg",
    "images": [
      "/images/jerseys/off-custom-1789332002533.jpg"
    ],
    "description": "Nueva camiseta del Barcelona en colaboración con Kobe Bryant",
    "name": "Barcelona Visita 26/27",
    "type": "Visitante",
    "league": "LaLiga",
    "genderCategory": "Unisex (Adulto)",
    "image": "/images/jerseys/off-custom-1789332002533.jpg",
    "price": 25000,
    "version": "Versión Jugador (Player Issue)",
    "reviewsCount": 1,
    "priceCRC": 25000,
    "fabricInfo": "Tecnología Aero-FIT",
    "isNew": true,
    "stock": 1,
    "team": "Barcelona"
  },
  {
    "isNew": true,
    "league": "LaLiga",
    "stock": 1,
    "type": "Local",
    "images": [],
    "name": "Real Madrid Local 26/27",
    "sizesAvailable": [
      "M"
    ],
    "version": "Versión Fan",
    "rating": 5,
    "reviewsCount": 1,
    "image": "/images/jerseys/off-custom-1791063070496.jpg",
    "yearSeason": "2026/2027",
    "price": 23000,
    "priceCRC": 23000,
    "genderCategory": "Unisex (Adulto)",
    "team": "Real Madrid",
    "backImage": "/images/jerseys/off-custom-1791063070496-back.jpg",
    "id": "off-custom-1791063070496",
    "description": "Nueva camiseta del Club Español para esta nueva temporada. ",
    "badgeTags": [
      "Nueva Temporada"
    ],
    "fabricInfo": "Tecnología CLIMACOOL"
  },
  {
    "rating": 5,
    "yearSeason": "2026/2027",
    "reviewsCount": 1,
    "stock": 1,
    "isNew": true,
    "version": "Versión Fan",
    "name": "Real Madrid Tercera 26/27",
    "price": 23000,
    "league": "LaLiga",
    "image": "/images/jerseys/off-custom-1791063310222.jpg",
    "images": [],
    "id": "off-custom-1791063310222",
    "type": "Tercera",
    "priceCRC": 23000,
    "sizesAvailable": [
      "S"
    ],
    "fabricInfo": "Tecnología CLIMACOOL ",
    "backImage": "/images/jerseys/off-custom-1791063310222-back.png",
    "genderCategory": "Femenina (Mujer)",
    "description": "Nueva camiseta del Club Español para esta nueva temporada. ",
    "team": "Real Madrid",
    "badgeTags": [
      "Nueva Temporada"
    ]
  },
  {
    "badgeTags": [
      "Nueva Temporada"
    ],
    "rating": 5,
    "yearSeason": "2026/2027",
    "team": "Real Madrid",
    "backImage": "/images/jerseys/off-custom-1791063433485-back.jpg",
    "league": "LaLiga",
    "genderCategory": "Unisex (Adulto)",
    "images": [],
    "sizesAvailable": [
      "M"
    ],
    "priceCRC": 23000,
    "id": "off-custom-1791063433485",
    "isNew": true,
    "name": "Real Madrid Tercera 26/27",
    "stock": 1,
    "type": "Tercera",
    "fabricInfo": "Tecnología CLIMACOOL ",
    "version": "Versión Fan",
    "description": "Nueva camiseta del Club Español para esta nueva temporada. ",
    "reviewsCount": 1,
    "image": "/images/jerseys/off-custom-1791063433485.jpg",
    "price": 23000
  },
  {
    "type": "Tercera",
    "id": "off-custom-1791063530511",
    "images": [],
    "fabricInfo": "Tecnología CLIMACOOL ",
    "league": "LaLiga",
    "image": "/images/jerseys/off-custom-1791063530511.jpg",
    "price": 25000,
    "name": "Real Madrid Tercera 26/27",
    "version": "Versión Jugador",
    "isNew": true,
    "stock": 1,
    "description": "Nueva camiseta del Club Español para esta nueva temporada. ",
    "rating": 5,
    "sizesAvailable": [
      "L"
    ],
    "backImage": "/images/jerseys/off-custom-1791063530511-back.jpg",
    "yearSeason": "2026/2027",
    "team": "Real Madrid",
    "genderCategory": "Unisex (Adulto)",
    "reviewsCount": 1,
    "badgeTags": [
      "Nueva Temporada"
    ],
    "priceCRC": 25000
  },
  {
    "genderCategory": "Unisex (Adulto)",
    "type": "Edición Especial",
    "fabricInfo": "100% Poliéster Reciclado Dri-FIT ADV",
    "backImage": "/images/jerseys/off-custom-1791064000408-back.jpg",
    "version": "Versión Fan",
    "name": "Saprissa x Batman",
    "id": "off-custom-1791064000408",
    "sizesAvailable": [
      "M"
    ],
    "priceCRC": 23000,
    "badgeTags": [
      "Batman🦇"
    ],
    "reviewsCount": 1,
    "isNew": true,
    "stock": 1,
    "team": "Saprissa",
    "yearSeason": "2025/2026",
    "rating": 5,
    "description": "Camiseta en colaboración con Warner Bros para crear esta increíble pieza de colección. ",
    "league": "Liga Promerica (CR)",
    "image": "/images/jerseys/off-custom-1791064000408.jpg",
    "price": 23000,
    "images": []
  },
  {
    "id": "off-custom-1791064186996",
    "team": "Juventus",
    "version": "Versión Fan",
    "genderCategory": "Unisex (Adulto)",
    "reviewsCount": 1,
    "fabricInfo": "Tecnología CLIMACOOL ",
    "sizesAvailable": [
      "L"
    ],
    "type": "Tercera",
    "isNew": true,
    "stock": 1,
    "rating": 5,
    "badgeTags": [
      "Nueva Temporada"
    ],
    "description": "Nueva camiseta del Club a Italiano con un diseño muy inusual para esta nueva temporada. \n",
    "name": "Juventus Tercera 26/27",
    "league": "Serie A",
    "priceCRC": 23000,
    "image": "/images/jerseys/off-custom-1791064186996.jpg",
    "backImage": "/images/jerseys/off-custom-1791064186996-back.jpg",
    "images": [],
    "price": 23000,
    "yearSeason": "2026/2027"
  },
  {
    "type": "Visitante",
    "images": [],
    "id": "off-custom-1791064293566",
    "image": "/images/jerseys/off-custom-1791064293566.jpg",
    "league": "Premier League",
    "price": 23000,
    "name": "Chelsea Visita 26/27",
    "isNew": true,
    "stock": 1,
    "fabricInfo": "Tecnología DRI-FIT",
    "reviewsCount": 1,
    "rating": 5,
    "team": "Chelsea",
    "backImage": "/images/jerseys/off-custom-1791064293566-back.jpg",
    "priceCRC": 23000,
    "genderCategory": "Unisex (Adulto)",
    "version": "Versión Fan",
    "yearSeason": "2026/2027",
    "badgeTags": [
      "Nueva Temporada"
    ],
    "description": "Nueva camiseta del Club Inglés campeón del mundo  para esta nueva temporada. \n",
    "sizesAvailable": [
      "XL"
    ]
  },
  {
    "description": "Nueva camiseta del Club Italiano para esta nueva temporada. \n",
    "backImage": "/images/jerseys/off-custom-1791064556775-back.jpg",
    "yearSeason": "2026/2027",
    "badgeTags": [
      "Nueva Temporada"
    ],
    "team": "AC Milán",
    "reviewsCount": 1,
    "image": "/images/jerseys/off-custom-1791064556775.jpg",
    "price": 23000,
    "rating": 5,
    "id": "off-custom-1791064556775",
    "fabricInfo": "Tecnología DryCELL ",
    "genderCategory": "Unisex (Adulto)",
    "images": [],
    "name": "AC Milán Visita 26/27",
    "priceCRC": 23000,
    "version": "Versión Fan",
    "sizesAvailable": [
      "M"
    ],
    "type": "Visitante",
    "isNew": true,
    "stock": 1,
    "league": "Serie A"
  },
  {
    "image": "/images/jerseys/off-custom-1791064678901.jpg",
    "price": 23000,
    "description": "Nueva camiseta del Club campeón de la champions para esta nueva temporada. \n",
    "id": "off-custom-1791064678901",
    "team": "PSG",
    "priceCRC": 23000,
    "isNew": true,
    "stock": 1,
    "fabricInfo": "Tecnología DRI-FIT ",
    "badgeTags": [
      "Nueva Temporada"
    ],
    "genderCategory": "Unisex (Adulto)",
    "version": "Versión Fan",
    "images": [],
    "league": "Ligue 1",
    "sizesAvailable": [
      "S"
    ],
    "type": "Visitante",
    "backImage": "/images/jerseys/off-custom-1791064678901-back.jpg",
    "reviewsCount": 1,
    "yearSeason": "2026/2027",
    "rating": 5,
    "name": "PSG Visita 26/27"
  },
  {
    "league": "Liga Argentina",
    "genderCategory": "Unisex (Adulto)",
    "type": "Retro",
    "originalPrice": 25000,
    "name": "Boca Juniors 94/95",
    "images": [],
    "sizesAvailable": [
      "XL"
    ],
    "priceCRC": 17000,
    "discountPercent": 30,
    "yearSeason": "1994/19995",
    "rating": 5,
    "reviewsCount": 1,
    "id": "off-custom-1791133931188",
    "stock": 1,
    "team": "Boca Juniors",
    "isNew": true,
    "description": "Camiseta oficial versión jugador con tela de alta definición.",
    "badgeTags": [
      "Retro"
    ],
    "fabricInfo": "Tecnología Olan",
    "version": "Versión Fan",
    "originalPriceCRC": 25000,
    "price": 17000,
    "image": "/images/jerseys/off-custom-1791133931188.jpg",
    "backImage": "/images/jerseys/off-custom-1791133931188-back.jpg"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    jerseyId: 'off-rm-2025-home',
    jerseyName: 'Camiseta Real Madrid Local 2024/25',
    userName: 'Camilo Andrés R.',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    date: '2026-07-28',
    comment: '¡Sencillamente espectacular! Pedí la camiseta del Real Madrid estampada con el 9 de Mbappé. La calidad de la tela y las tipografías oficiales es de otro nivel. Llegó a San José en menos de 24 horas con Correos de CR.',
    verifiedBuyer: true,
    team: 'Real Madrid'
  },
  {
    id: 'rev-2',
    jerseyId: 'off-colombia-2024-home',
    jerseyName: 'Camiseta Selección Colombia Amarilla 100 Años FCF',
    userName: 'Sofía Montoya',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    date: '2026-07-20',
    comment: 'La horma queda perfecta en talla M. El color amarillo es vivo y la tela es súper fresca para hacer deporte o ver el partido en familia. Los parches de la Copa América se ven 10/10.',
    verifiedBuyer: true,
    team: 'Selección Colombia'
  },
  {
    id: 'rev-3',
    jerseyId: 'off-retro-rm-2002',
    jerseyName: 'Camiseta Retro Real Madrid 2002 Centenario Zidane #5',
    userName: 'Mateo Restrepo',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    date: '2026-07-15',
    comment: 'Como coleccionista de prendas retro quedé gratamente sorprendido. El estampado de terciopelo del #5 de Zidane es exactamente como el de la época. ¡Muy recomendados!',
    verifiedBuyer: true,
    team: 'Real Madrid'
  },
  {
    id: 'rev-4',
    jerseyId: 'off-mancity-2025-home',
    jerseyName: 'Camiseta Manchester City Edición Especial Oasis 2024/25',
    userName: 'Daniel Buitrago',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    date: '2026-07-02',
    comment: 'Atención excelente por WhatsApp. Tenía dudas sobre si elegir talla L o XL, me asesoraron de inmediato y me enviaron fotos reales de la prenda antes del despacho. Un servicio 5 estrellas.',
    verifiedBuyer: true,
    team: 'Manchester City'
  }
];
