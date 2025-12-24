import { useEffect, useState } from "react";
import Shimmer from "./Shimmer";

const Body = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Shimmer />;
    }

    return (
        <div className="body-container">
            <h1>BioLifts: Solo Fitness Trainer</h1>
            <p>
                Welcome to BioLifts, your personal gym companion! Track your workouts, get personalized routines, and unlock your fitness potential.
            </p>
            <ul>
                <li>Custom workout plans</li>
                <li>Progress tracking</li>
                <li>Door-based exercises</li>
                <li>Trainer tips and guidance</li>
            </ul>
            <button className="start-btn">Start Training</button>
        </div>
    );
};

export default Body; 