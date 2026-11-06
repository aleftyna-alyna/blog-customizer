import { defaultArticleState } from '@/constants/articleProps.ts';
import { clsx } from 'clsx';
import { useState, type CSSProperties } from 'react';

import { ArticleParamsForm } from '@components/article-params-form';

import { Article } from '../article/Article';

import styles from './app.module.scss';

type ArticleStateType = typeof defaultArticleState;

export const App = (): React.JSX.Element => {
  //состояние примененых настроке статьи
  const [currentArticleState, setCurrentArticleState] =
    useState<ArticleStateType>(defaultArticleState);

  //обработчик  применения новых настроек из форм
  const handleApplySettings = (newSettings: ArticleStateType): void => {
    setCurrentArticleState(newSettings);
  };

  // обработчик сброса настроек к дефолтным
  const handleResetSettings = (): void => {
    setCurrentArticleState(defaultArticleState);
  };

  return (
    <main
      className={clsx(styles.main)}
      style={
        {
          '--font-family': currentArticleState.fontFamilyOption.value,
          '--font-size': currentArticleState.fontSizeOption.value,
          '--font-color': currentArticleState.fontColor.value,
          '--container-width': currentArticleState.contentWidth.value,
          '--bg-color': currentArticleState.backgroundColor.value,
        } as CSSProperties
      }
    >
      <ArticleParamsForm
        currentSettings={currentArticleState}
        onApply={handleApplySettings}
        onReset={handleResetSettings}
      />
      <Article />
    </main>
  );
};
