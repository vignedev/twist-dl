# twist-dl
Simple twist.moe anime downloader

## Archivation

It seems that AnimeTwist's servers have gone down for quite a while now and I do not have the motivation to continue or support this project for quite some time now nor do I have a reason to do so anymore. Hence, this project is now archived most likely pernamently.

## Installation

Install it via npm as a global module
```bash
npm i twist-dl -g
```

## Usage

### Interactive CLI
```bash
$ twist-dl
```
Just type `twist-dl` to your terminal/cmd.

This will launch a simple interface that can be easily controlled via arrow keys, space and enter.

Anime list and sources are directly fetched from twist.moe. It will download into your currently working directory under the same filename as it is on their servers.

### With arguments

You can also download anime via CLI if that's what you prefer. Down below you can see the help message.
```bash
$ twist-dl -h
```
```
Usage: twist-dl -a <anime name> -e <episode> [-o <output>]

Options:

  -a, --anime       Name of the anime, can be partial
  -e, --episode     Which episode to download (1 = episode 1)
  -o, --output      Folder in which it'll be downloaded in, use - to output to stdout
  -h, --help        Displays this message
  -s, --silent      Suppress any (except of donation message) output
  -E, --english     Search anime names using English titles
  -f, --force       Always download, never restore broken downloads
  -l, --list        Instead of downloading, pipe out a list of selected episodes
```
#### Examples
```bash
$ twist-dl -a "yuyushiki" -e latest           # Download latest episode of Yuyushiki
$ twist-dl -a "yuyushiki" -e 12               # Download 12th episode
$ twist-dl -a "yuyushiki" -e 12 -o -          # Pipe the 12th episode into stdout (transcoding purposes etc.)
$ twist-dl -a "yuyushiki" -e 1-12             # Download everything from episode 1 to 12
$ twist-dl -a "yuyushiki" -e 12 -o "./yyshk"  # Download 12th episode into "yyshk" folder
$ twist-dl -a "yuyushiki" -e 1,3              # Download only the 1st and 3rd episode
$ twist-dl -a "yuyushiki" -e 1,5-8            # Download 1st episode and episodes 5 to 8
$ twist-dl https://twist.moe/a/yuyushiki/12   # Download 12th episode
```

## Disclaimer

twist-dl or vignedev are **not** affiliated with twist.moe.

This program is made for personal-use only. If you like the program, please ***donate to the Twist.Moe admins*** so they can keep the servers up and running.

## License

MIT
