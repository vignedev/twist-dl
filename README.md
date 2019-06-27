# twist-dl
Simple twist.moe anime downloader

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
```
#### Examples
```bash
$ twist-dl -a "yuyushiki" -e latest           # Download latest episode of Yuyushiki
$ twist-dl -a "yuyushiki" -e 12               # Download 12th episode
$ twist-dl -a "yuyushiki" -e 12 -o -          # Pipe the 12th episode into stdout (transcoding purposes etc.)
$ twist-dl -a "yuyushiki" -e 1-12             # Download everything from episode 1 to 12
$ twist-dl -a "yuyushiki" -e 12 -o "./yyshk"  # Download 12th episode into "yyshk" folder
$ twist-dl https://twist.moe/a/yuyushiki/12   # Download 12th episode
```

## Disclaimer

twist-dl nor vignedev are **not** affiliated with twist.moe.

This program is made for personal-use only. If you like the program, please ***donate to the Twist.Moe admins*** so they can keep the servers up and running.

## License

MIT
