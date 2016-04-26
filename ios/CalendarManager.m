//
//  CalendarManager.m
//  RNFeatureList
//
//  Created by pptv on 4/21/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "CalendarManager.h"
#import "RCTLog.h"
#import "RCTConvert.h"

@implementation CalendarManager

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(addEvent:(NSString *)name details:(NSDictionary *)details)
{
  NSString *location = [RCTConvert NSString:details[@"location"]];
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_REMAP_METHOD(findEvents,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@"success");
  
}

@end
