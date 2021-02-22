import { TestBed } from '@angular/core/testing';

import { DownloadchartService } from './downloadchart.service';

describe('DownloadchartService', () => {
  let service: DownloadchartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadchartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
