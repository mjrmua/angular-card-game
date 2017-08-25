import { AuthService } from './user/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MdToolbarModule } from '@angular/material';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MdToolbarModule],
      declarations: [ AppComponent ],
      providers: [
        {
          provide: AuthService,
          useClass: class {},
        },
    ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
