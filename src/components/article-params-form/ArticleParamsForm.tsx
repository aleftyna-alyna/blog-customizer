import { clsx } from 'clsx';
import { useState, useRef, useEffect } from 'react';
import {
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { defaultArticleState } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleStateType = typeof defaultArticleState;

type ArticleParamsFormProps = {
  currentSettings: ArticleStateType;
  onApply: (newSettings: ArticleStateType) => void;
  onReset: () => void;
};

export const ArticleParamsForm = ({
  currentSettings,
  onApply,
  onReset,
}: ArticleParamsFormProps): React.JSX.Element => {
  //  состояние открытия и закрытия сайдбара

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // локальные состояния формы - буфер настроек

  const [formState, setFormState] = useState<ArticleStateType>(currentSettings);

  // синхронизация локального стейт , если внешние настройки изменились

  useEffect(() => {
    setFormState(currentSettings);
  }, [currentSettings]);

  // переключаем сайдбар
  const toggleForm = (): void => setIsOpen((prev) => !prev);

  // управление слушателем событий
  useEffect(() => {
    // если форма закрыта слушатель даже не создается
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent): void => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    //функция очистки
    return (): void => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]); // эффект перезапускается строго при изменении состояния

  //обработчик изменения полей
  const handleFieldChange = (
    key: keyof ArticleStateType,
    value: ArticleStateType[keyof ArticleStateType]
  ): void => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // отправка формы - применение стилей
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onApply(formState);
  };

  // очистка форм (сброс дефолт)
  const handleReset = (e: React.FormEvent): void => {
    e.preventDefault();
    onReset();
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={toggleForm} />
      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isOpen,
        })}
        ref={sidebarRef}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase={true}>
            Задать параметры
          </Text>

          {/*выбор шрифта*/}
          <Select
            selected={formState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={(val) => handleFieldChange('fontFamilyOption', val)}
            title="Шрифт"
          />

          {/*выбор размера шрифта*/}
          <RadioGroup
            name="fontSize"
            selected={formState.fontSizeOption}
            options={fontSizeOptions}
            onChange={(val) => handleFieldChange('fontSizeOption', val)}
            title="Размер шрифта"
          />

          {/*выбор цвета текста */}

          <Select
            selected={formState.fontColor}
            options={fontColors}
            onChange={(val) => handleFieldChange('fontColor', val)}
            title="Цвет текста"
          />

          <Separator />

          {/*выбор цвета фона*/}

          <Select
            selected={formState.backgroundColor}
            options={backgroundColors}
            onChange={(val) => handleFieldChange('backgroundColor', val)}
            title="Цвет фона"
          />

          {/*выбор ширины контента */}

          <Select
            selected={formState.contentWidth}
            options={contentWidthArr}
            onChange={(val) => handleFieldChange('contentWidth', val)}
            title="ширина контента"
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
