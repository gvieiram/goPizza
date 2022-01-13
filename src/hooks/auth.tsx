/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextData = {
  // todo
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
