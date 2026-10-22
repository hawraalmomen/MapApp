
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, authReady } from './firebase';

export default function App() {
  const [position, setPosition] = useState(null);
  const [besked, setBesked] = useState('Finder din placering...');
  const [markers, setMarkers] = useState([]);

  const mapView = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    async function startListening() {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setBesked('Du har ikke givet adgang til placering.');
          return;
        }

        setBesked('Leder efter din placering...');

        locationSubscription.current =
          await Location.watchPositionAsync(
            {
              distanceInterval: 100,
              accuracy: Location.Accuracy.High,
            },
            (lokation) => {
              const newPosition = {
                latitude: lokation.coords.latitude,
                longitude: lokation.coords.longitude,
              };

              setPosition(newPosition);
              setBesked('Din placering er fundet.');
            }
          );
      } catch (error) {
        setBesked('Kunne ikke hente din placering.');
        console.error('GPS-fejl:', error);
      }
    }

    startListening();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  async function addMarker(data) {
    alert('Langt tryk registreret!');

    const { latitude, longitude } =
      data.nativeEvent.coordinate;

    try {
      await authReady;

      const docRef = await addDoc(collection(db, 'markers'), {
        latitude,
        longitude,
        title: 'Great place',
        createdAt: serverTimestamp(),
      });
 
      const newMarker = {
        coordinate: { latitude, longitude },
        key: docRef.id,
        title: 'Great place',
      };

      setMarkers((previousMarkers) => [
        ...previousMarkers,
        newMarker,
      ]);

    setBesked('Markør gemt i Firestore');

  } catch (error) {
    console.error('Fejl  ved lagring af markør:', error);
    setBesked('Markøren kunne ikke gemmes i Firestore')
    alert('Markøren kunne ikke gemmes. Tjek forbindelsen til internettet');
  }
}

function onMarkerPressed(text) {
    alert('Du har trykket ' + text);
}

  return (
    <View style={styles.container}>
      <MapView
        ref={mapView}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onLongPress={addMarker}
        initialRegion={{
          latitude: 55.6761,
          longitude: 12.5683,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={position !== null}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => onMarkerPressed(marker.title)}
          />
        ))}

        {position && (
          <Marker
            coordinate={position}
            title="Du er her"
          />
        )}
      </MapView>

      <View style={styles.status}>
        <Text>{besked}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  status: {
    padding: 12,
    backgroundColor: 'white',
  },
});
