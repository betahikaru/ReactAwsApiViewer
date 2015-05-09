/**
 * Copyright (c) 2015, betahikaru.
 * All rights reserved.
 * MIT
 */

#import "OpenSettingAppModule.h"

@implementation OpenSettingAppModule

RCT_EXPORT_MODULE();

// Example:
//   OpenSettingAppModule.canOpenSettingsApp(
//     (results) => {
//       var canOpen = results[0];
//       var iosVersion = results[1];
//       if (canOpen) {
//         << Open Settings.app >>
//       } else {
//         << Don't open Settings.app >>
//       }
//     }
//   );
RCT_EXPORT_METHOD(canOpenSettingsApp:(RCTResponseSenderBlock)callback)
{
  NSString *methodName = @"canOpenSettingsApp:callback";
  RCTLogInfo(@"Start %@", methodName);
  UIDevice *device = [UIDevice currentDevice];
  NSString *versionStr = [device systemVersion];
  NSString *versionSupportedOpening = @"8.0";
  NSComparisonResult resultCompare = [[device systemVersion]
                                       compare:versionSupportedOpening
                                       options:NSNumericSearch];

  // iOS 8.0 and later can open Settings.app
  if (resultCompare != NSOrderedDescending) {
    RCTLogInfo(@"[%@] Not available to open Settings.app (iOS version = %@)", methodName, versionStr);
    callback(@[@false, versionStr]);
  } else {
    // URLWithString:UIApplicationOpenSettingsURLString is available in iOS 8.0 and later
    NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    BOOL canOpen = [[UIApplication sharedApplication] canOpenURL:url];
    if (canOpen) {
      RCTLogInfo(@"[%@] Available to open Settings.app", methodName);
      callback(@[@true, versionStr]);
    } else {
      RCTLogInfo(@"[%@] iOS 8.0 or later, but not available to open Settings.app (iOS version = %@)", methodName, versionStr);
      callback(@[@false, versionStr]);
    }
  }
  RCTLogInfo(@"Finish %@", methodName);
}

// Example:
//   OpenSettingAppModule.openSettingsApp(
//     (result) => {
//       var opened = result;
//       if (opened) {
//         << Opened Settings.app >>
//       }
//     }
//   );
RCT_EXPORT_METHOD(openSettingsApp:(RCTResponseSenderBlock)callback)
{
  NSString *methodName = @"openSettingsApp:callback";
  RCTLogInfo(@"Start %@", methodName);

  NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
  BOOL result = [[UIApplication sharedApplication] openURL:url];
  if (result) {
    RCTLogInfo(@"[%@] Succeed to open Settings.app", methodName);
    callback(@[@true]);
  } else {
    RCTLogInfo(@"[%@] Failed to open Settings.app", methodName);
    callback(@[@false]);
  }
  RCTLogInfo(@"Finish %@", methodName);
}

@end
