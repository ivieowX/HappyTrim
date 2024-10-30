import React, { createContext, useReducer, useContext } from 'react';

const FoodContext = createContext();

const initialState = {
    foodHistory: [],
};

const foodReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_FOOD':
            return {
                ...state,
                foodHistory: [...state.foodHistory, action.payload],
            };
        default:
            return state;
    }
};

export const FoodProvider = ({ children }) => {
    const [state, dispatch] = useReducer(foodReducer, initialState);

    return (
        <FoodContext.Provider value={{ state, dispatch }}>
            {children}
        </FoodContext.Provider>
    );
};

export const useFoodContext = () => useContext(FoodContext);
