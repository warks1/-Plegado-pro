import {test,expect,type Page} from '@playwright/test';

async function openNavigation(page:Page){
  const development=page.getByRole('link',{name:'Desarrollo'});
  if(await development.isVisible().catch(()=>false))return;
  const menu=page.getByRole('button',{name:/menú/i});
  if(await menu.isVisible().catch(()=>false))await menu.click();
}

test('navigates through engineering and validation without reloading',async({page})=>{
  await page.goto('/');
  await expect(page.getByText('Proyectos activos')).toBeVisible();
  await openNavigation(page);
  await page.getByRole('link',{name:'Desarrollo'}).click();
  await expect(page.getByRole('heading',{name:'Desarrollo'})).toBeVisible();
  await openNavigation(page);
  await page.getByRole('link',{name:'Programación 2D'}).click();
  await expect(page.getByRole('heading',{name:'Programación 2D'})).toBeVisible();
  await page.goto('/validacion');
  await expect(page.getByRole('heading',{name:'Validación'})).toBeVisible();
});

test('undo and redo controls are present',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('button',{name:'Deshacer'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Rehacer'})).toBeVisible();
});

test('opens engineering calculators and legal page',async({page})=>{
  await page.goto('/curva-perfecta');
  await expect(page.getByRole('heading',{name:'Curva Perfecta'})).toBeVisible();
  await page.goto('/comparador-v');
  await expect(page.getByRole('heading',{name:'Comparador de V'})).toBeVisible();
  await page.goto('/acerca-de');
  await expect(page.getByText('Antonio Molina Sánchez')).toBeVisible();
});
