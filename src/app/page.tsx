'use client';
import { useState } from 'react';
import SessionCheckerForHome from "./components/SessionCheckerForHome";
import { StoreProvider } from "./redux/StoreProvider";
import TextSummarization from "./components/TextSummarization";
import LoggedInHeader from "./components/LoggedInHeader";
import TextSummaries from './components/TextSummaries';

export default function Home() {

  return (
    <main>
      <StoreProvider>
      <SessionCheckerForHome/>
      </StoreProvider>
    </main>
  );
}
