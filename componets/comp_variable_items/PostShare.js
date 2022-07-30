import { shareAsync } from 'expo-sharing';

import { createDownloadResumable, cacheDirectory } from 'expo-file-system'; 

import { Platform } from 'react-native';

let SHARING = false;

export async function Share (url, title) {

    if (SHARING) return;
    SHARING = true;

    if (Platform.OS === 'web') return;

    try {
        const { uri } = await createDownloadResumable(url, cacheDirectory + "share-" + title.replace(/\s/g, '_') + ".jpg", {}).downloadAsync();
        shareAsync(uri, {
            dialogTitle: 'Ty dźěliš wobraz wot posta "' + title + '"',
        })
        .finally(() => SHARING = false)

    } catch (e) {
        console.log("error", e);
        SHARING = false;
    }

}