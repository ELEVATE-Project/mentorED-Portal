import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from './modules/layout/layout.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { DbConfig } from './core/constants/dbConfig';

const dbConfig:DBConfig = DbConfig;

export function translateHttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (translateHttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
