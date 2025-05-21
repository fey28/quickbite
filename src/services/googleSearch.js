import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'AIzaSyCJrhVvnd-cPSwQGTVH9bRXXu8U826enKc', // 🔑 cheia de la Google Cloud Console
  libraries: ['places'],
});

export async function searchPlace(query) {
  const google = await loader.load();

  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      query,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      console.log('Google Results:', results, 'Status:', status); // 💡 adaugă asta pentru test
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const place = results[0];
        resolve({
          name: place.name,
          position: [
            place.geometry.location.lat(),
            place.geometry.location.lng(),
          ],
        });
      } else {
        reject(new Error('Locație negăsită'));
      }
    });
  });
}
