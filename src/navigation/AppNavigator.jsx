import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../private/homeTab/homeScreen';
import CollectionScreen from '../private/collectionTab/collectionScreen';
import TestDriveScreen from '../private/testDriveTab/testDriveScreen';
import AboutScreen from '../private/aboutTab/aboutScreen';
import { ROUTES } from '../utils/navigation';

export default function AppNavigator() {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<HomeScreen />} />
            <Route path={ROUTES.COLLECTION} element={<CollectionScreen />} />
            <Route path={ROUTES.TEST_DRIVE} element={<TestDriveScreen />} />
            <Route path={ROUTES.ABOUT} element={<AboutScreen />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
    );
}
