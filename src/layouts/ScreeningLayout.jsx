import { Outlet } from "react-router-dom";
import FocusTracker from "../components/FocusTrackerV2";

export default function ScreeningLayout() {
    return (
        <>
            <Outlet />
            <FocusTracker />
        </>
    );
}